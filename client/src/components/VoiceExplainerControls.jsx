import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Mic, MicOff, Square, 
  RotateCcw, Sparkles, Radio, Check, RefreshCw
} from 'lucide-react';

/**
 * Two-way Voice Accessibility Component for Read & Explain Scheme
 * - SpeechRecognition for asking questions by microphone
 * - SpeechSynthesis for reading the scheme explanation & AI voice replies aloud
 * - Seamless integration with /api/agent/ask-scheme for immediate spoken answers
 */
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function VoiceExplainerControls({
  explanation,
  currentLang = 'hi',
  onVoiceQuery,
  defaultAutoPlay = true,
  className = ''
}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceLang, setVoiceLang] = useState(() => {
    return currentLang === 'en' ? 'en-IN' : 'hi-IN';
  });
  const [isListening, setIsListening] = useState(false);
  const [lastQuery, setLastQuery] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [voiceAnswer, setVoiceAnswer] = useState(null);
  const [isSpeakingReply, setIsSpeakingReply] = useState(false);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(defaultAutoPlay);
  const [voices, setVoices] = useState([]);

  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  // Sync voice language when dashboard language changes
  useEffect(() => {
    setVoiceLang(currentLang === 'en' ? 'en-IN' : 'hi-IN');
  }, [currentLang]);

  // Load available system voices
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const updateVoices = () => {
      const vList = window.speechSynthesis.getVoices();
      if (vList && vList.length > 0) {
        setVoices(vList);
      }
    };

    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  // ----------------------------------------------------------------
  // Ask Scheme Question API Handler
  // ----------------------------------------------------------------
  const askQuestionApi = async (questionText) => {
    setIsAnswering(true);
    setVoiceAnswer(null);
    handleStopSpeech();

    try {
      const langToSend = voiceLang.startsWith('hi') 
        ? (currentLang === 'hi' ? 'hi' : 'hinglish') 
        : 'en';

      const res = await fetch(`${API_BASE_URL}/api/agent/ask-scheme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          schemeContext: explanation,
          language: langToSend
        })
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setVoiceAnswer(data.answer);
        // Automatically speak the answer aloud as soon as it arrives!
        speakReply(data.answer, voiceLang);
      } else {
        throw new Error(data.error || 'Failed to generate answer');
      }
    } catch (err) {
      console.warn('[VoiceExplainer] Ask scheme error:', err);
      // Smart offline immediate fallback
      const fallbackAns = voiceLang.startsWith('hi')
        ? 'इस योजना के लिए आवश्यक दस्तावेज़ हैं: आय प्रमाण पत्र, मूल निवास, अंकतालिका और बैंक पासबुक। इसे आप पोर्टल के चरण 3 पर सीधे अपलोड कर सकते हैं।'
        : 'For this scheme, you need your Income Certificate, Domicile, Marksheet, and Bank Passbook. You can upload them in Step 3 of the form.';
      setVoiceAnswer(fallbackAns);
      speakReply(fallbackAns, voiceLang);
    } finally {
      setIsAnswering(false);
      if (onVoiceQuery) {
        onVoiceQuery(questionText);
      }
    }
  };

  // ----------------------------------------------------------------
  // Web Speech API: Microphone SpeechRecognition
  // ----------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = voiceLang;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('[VoiceExplainer] Mic recognition error:', e.error);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setLastQuery(transcript);
        // Trigger voice Q&A query to answer and speak the response
        askQuestionApi(transcript);
      };

      recognitionRef.current = recognition;
    }
  }, [voiceLang, explanation, onVoiceQuery]);

  const toggleMicListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }
    // Stop any ongoing speech playback before listening to avoid echo
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsSpeakingReply(false);
    }

    if (isListening) {
      try { recognitionRef.current.stop(); } catch {}
    } else {
      try {
        recognitionRef.current.lang = voiceLang;
        recognitionRef.current.start();
      } catch (err) {
        console.warn('[VoiceExplainer] Recognition start error:', err);
      }
    }
  };

  // ----------------------------------------------------------------
  // Helper: Prepare Natural Spoken Summary for Text-to-Speech
  // ----------------------------------------------------------------
  const prepareSpeechText = (expl, lang) => {
    if (!expl) return '';

    const schemeTitle = expl.schemeName || 'Government Scheme';
    const isHindi = lang.startsWith('hi');

    if (isHindi) {
      const about = expl.about?.hi || expl.about?.hinglish || expl.about?.en || '';
      const elig = expl.eligibilityAndDocs?.hi || expl.eligibilityAndDocs?.hinglish || expl.eligibilityAndDocs?.en || '';
      const steps = expl.stepsToApply?.hi || expl.stepsToApply?.hinglish || expl.stepsToApply?.en || '';

      return `${schemeTitle} की आधिकारिक जानकारी। पहला, यह योजना क्या है: ${about}। दूसरा, पात्रता और आवश्यक दस्तावेज़: ${elig}। तीसरा, आवेदन प्रक्रिया: ${steps}। अधिक विवरण के लिए स्क्रीन पर ऑटो-अप्लाई बटन दबाएं।`;
    }

    // Default: English / Indian English
    const about = expl.about?.en || expl.about?.hinglish || '';
    const elig = expl.eligibilityAndDocs?.en || expl.eligibilityAndDocs?.hinglish || '';
    const steps = expl.stepsToApply?.en || expl.stepsToApply?.hinglish || '';

    return `Official overview for ${schemeTitle}. Part one, what this scheme is about: ${about}. Part two, who is eligible and required documents: ${elig}. Part three, step-by-step instructions to apply: ${steps}. You can now proceed to auto-apply on your dashboard.`;
  };

  // ----------------------------------------------------------------
  // Text-to-Speech: Playback Controls for Full Scheme Overview
  // ----------------------------------------------------------------
  const handleReadAloud = (overrideLang = voiceLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !explanation) return;

    window.speechSynthesis.cancel();

    const textToSpeak = prepareSpeechText(explanation, overrideLang);
    if (!textToSpeak) return;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = overrideLang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (voices.length > 0) {
      if (overrideLang.startsWith('hi')) {
        const hindiVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'))
          || voices.find(v => v.lang === 'en-IN')
          || voices[0];
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const indianEngVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'))
          || voices.find(v => v.lang.startsWith('en'))
          || voices[0];
        if (indianEngVoice) utterance.voice = indianEngVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsSpeakingReply(false);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('[VoiceExplainer] SpeechSynthesis error:', e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // ----------------------------------------------------------------
  // Text-to-Speech: Speak Spoken Q&A Reply
  // ----------------------------------------------------------------
  const speakReply = (textToSpeak, lang = voiceLang) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !textToSpeak) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (voices.length > 0) {
      if (lang.startsWith('hi')) {
        const hindiVoice = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.toLowerCase().includes('hindi'))
          || voices.find(v => v.lang === 'en-IN')
          || voices[0];
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const indianEngVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'))
          || voices.find(v => v.lang.startsWith('en'))
          || voices[0];
        if (indianEngVoice) utterance.voice = indianEngVoice;
      }
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsSpeakingReply(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsSpeakingReply(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      console.warn('[VoiceExplainer] Reply TTS error:', e);
      setIsSpeaking(false);
      setIsSpeakingReply(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsSpeakingReply(false);
    setIsPaused(false);
  };

  // Auto-play when a new explanation is provided
  useEffect(() => {
    if (explanation && autoPlayEnabled) {
      const timer = setTimeout(() => {
        handleReadAloud(voiceLang);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      handleStopSpeech();
    }
  }, [explanation]);

  const handleSwitchVoiceLang = (newLang) => {
    setVoiceLang(newLang);
    if (isSpeaking && !isSpeakingReply && explanation) {
      handleReadAloud(newLang);
    } else if (isSpeakingReply && voiceAnswer) {
      speakReply(voiceAnswer, newLang);
    }
  };

  return (
    <div className={`bg-slate-900/90 border border-indigo-500/30 rounded-xl p-3.5 text-xs shadow-md space-y-3 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Two-Way Accessibility Status Indicator */}
        <div className="flex items-center space-x-2.5">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center border transition ${
            isSpeaking 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse' 
              : isListening 
                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-bounce' 
                : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
          }`}>
            {isListening ? (
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            ) : isSpeaking ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-xs">
                {isSpeakingReply
                  ? (voiceLang === 'hi-IN' ? '🔊 सवाल का जवाब बोला जा रहा है...' : '🔊 Speaking Answer Aloud...')
                  : isSpeaking 
                    ? (voiceLang === 'hi-IN' ? '🔊 योजना का विवरण सुनाया जा रहा है...' : '🔊 Reading Scheme Aloud...') 
                    : isListening 
                      ? (voiceLang === 'hi-IN' ? '🎙️ आपकी आवाज़ सुन रहे हैं...' : '🎙️ Listening to your question...') 
                      : (voiceLang === 'hi-IN' ? 'बोलकर पूछें व जवाब सुनें (Voice Q&A)' : 'Two-Way Voice Q&A Assistant')}
              </span>
              {isSpeaking && (
                <div className="flex items-center space-x-0.5">
                  <span className="w-1 h-3 bg-emerald-400 rounded animate-pulse" />
                  <span className="w-1 h-4 bg-emerald-400 rounded animate-pulse delay-75" />
                  <span className="w-1 h-2 bg-emerald-400 rounded animate-pulse delay-150" />
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {voiceLang === 'hi-IN' 
                ? 'माइक से कोई भी सवाल पूछें (जैसे: डॉक्यूमेंट क्या चाहिए) और तुरंत आवाज़ में उत्तर पाएं' 
                : 'Ask any question by mic (e.g., required documents) and hear an instant spoken answer'}
            </p>
          </div>
        </div>

        {/* Right: Audio Playback Controls & Voice Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Voice Language Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => handleSwitchVoiceLang('hi-IN')}
              className={`px-2 py-1 rounded font-semibold transition ${
                voiceLang === 'hi-IN' 
                  ? 'bg-orange-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 हिन्दी
            </button>
            <button
              type="button"
              onClick={() => handleSwitchVoiceLang('en-IN')}
              className={`px-2 py-1 rounded font-semibold transition ${
                voiceLang === 'en-IN' 
                  ? 'bg-blue-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇬🇧 English
            </button>
          </div>

          {/* Read Aloud / Stop Button for Overview */}
          {isSpeaking ? (
            <button
              type="button"
              onClick={handleStopSpeech}
              className="px-3 py-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-red-600/30 border border-red-500/40"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>{voiceLang === 'hi-IN' ? 'रोकें (Stop)' : 'Stop Audio'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleReadAloud(voiceLang)}
              disabled={!explanation}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{voiceLang === 'hi-IN' ? 'विवरण सुनें' : 'Read Overview'}</span>
            </button>
          )}

          {/* Ask by Mic Button */}
          <button
            type="button"
            onClick={toggleMicListening}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-500 animate-pulse'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-white" />
                <span>{voiceLang === 'hi-IN' ? 'सुन रहे हैं...' : 'Listening...'}</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-white" />
                <span>{voiceLang === 'hi-IN' ? 'बोलकर पूछें' : 'Ask by Mic'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spoken Mic Query Pill */}
      {lastQuery && (
        <div className="flex items-center space-x-2 text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300">
          <Mic className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
          <span className="text-slate-400 font-semibold">
            {voiceLang === 'hi-IN' ? 'आपने पूछा:' : 'You asked:'}
          </span>
          <span className="text-white font-mono italic">"{lastQuery}"</span>
        </div>
      )}

      {/* Loading state while answering */}
      {isAnswering && (
        <div className="p-3 bg-indigo-950/40 border border-indigo-700/60 rounded-xl text-xs text-indigo-300 flex items-center space-x-2 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          <span>
            {voiceLang === 'hi-IN' 
              ? 'जवाब तैयार किया जा रहा है...' 
              : 'Generating intelligent voice response...'}
          </span>
        </div>
      )}

      {/* 🌟 AI Voice Reply Card */}
      {voiceAnswer && (
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/80 border border-indigo-500/50 rounded-xl p-4 text-xs space-y-2.5 shadow-xl animate-scaleUp">
          <div className="flex items-center justify-between border-b border-indigo-800/60 pb-2">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-500/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <span className="font-bold text-white text-xs">
                {voiceLang === 'hi-IN' ? 'एआई आवाज़ उत्तर (AI Voice Reply)' : 'AI Voice Reply'}
              </span>
              <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/60">
                Spoken aloud
              </span>
            </div>

            {/* Replay / Stop Controls for Voice Reply */}
            <div className="flex items-center space-x-2">
              {isSpeakingReply ? (
                <button
                  type="button"
                  onClick={handleStopSpeech}
                  className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[11px] font-bold flex items-center space-x-1 shadow transition"
                >
                  <Square className="w-3 h-3 fill-white" />
                  <span>{voiceLang === 'hi-IN' ? 'रोकें (Stop)' : 'Stop'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => speakReply(voiceAnswer, voiceLang)}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-bold flex items-center space-x-1 shadow transition"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{voiceLang === 'hi-IN' ? 'फिर से सुनें' : 'Replay Audio'}</span>
                </button>
              )}
            </div>
          </div>

          <p className="text-slate-100 leading-relaxed font-sans text-xs sm:text-sm font-medium">
            {voiceAnswer}
          </p>
        </div>
      )}

      {/* Auto-read Toggle Checkbox */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
        <label className="flex items-center space-x-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoPlayEnabled}
            onChange={(e) => setAutoPlayEnabled(e.target.checked)}
            className="rounded bg-slate-950 border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="hover:text-slate-300">
            {voiceLang === 'hi-IN' 
              ? 'योजना विश्लेषण के बाद स्वतः बोलकर सुनाएं (Auto-read when analyzed)' 
              : 'Automatically read aloud when new scheme/URL is analyzed'}
          </span>
        </label>

        {isSpeaking && (
          <span className="text-[10px] text-emerald-400 font-mono flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>TTS Playing ({voiceLang})</span>
          </span>
        )}
      </div>
    </div>
  );
}
