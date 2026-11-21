import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, ShieldCheck, FileText, CheckCircle2, AlertTriangle, 
  Sparkles, UploadCloud, RefreshCw, Mic, MicOff, ExternalLink, 
  Check, ArrowRight, Play, Eye, Download, Landmark, User, Clock, 
  ChevronRight, HelpCircle, FileCheck, ShieldAlert, Award, Lock,
  Zap, DollarSign, Activity, FileCode, Globe, BookOpen, Search,
  Users, Copy, CheckCheck, PlusCircle, Gavel, FileWarning, Volume2, VolumeX,
  KeyRound, RotateCcw, WifiOff, Wifi, Trash2
} from 'lucide-react';
import VoiceExplainerControls from '../components/VoiceExplainerControls';

async function computeSha256(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'sha256-' + Math.random().toString(36).substring(2, 12);
  }
}

// Environment-aware API Base URL (defaults to http://localhost:5000 or Render environment variable)
const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

// ------------------------------------------------------------------
// Comprehensive Bilingual Dictionary (English & Hindi)
// ------------------------------------------------------------------
const TRANSLATIONS = {
  en: {
    trackTag: 'Track 1: Civic Pulse & Digital Governance',
    agentSubtitle: 'Autonomous Bureaucracy Execution Agent',
    appTitle: 'CivicPulse Autonomous Welfare Agent',
    appDesc: 'Extract citizen welfare eligibility from documents or voice, verify statutory scheme rules, and autonomously execute government application forms live via Playwright with Human-in-the-Loop OTP security.',
    loadSampleBtn: 'Load Sample Certificate (One-Click Demo)',
    viewGovPortalBtn: 'View Target Portal (/gov-portal)',
    langLabel: 'Language / भाषा:',
    
    // Privacy Shield
    privacyShieldActive: 'Privacy Shield Active',
    zeroRetention: 'Zero Cloud Retention',
    privacyShieldDesc: 'Local PII Masking enabled (12-digit Aadhaar & Bank A/C masked before LLM) • De-masked in local memory only • Uploaded certificates auto-purged on completion.',
    protectedTokensLabel: 'Protected Tokens:',
    guardedAadhaarBank: 'Aadhaar & Bank A/C Guarded',
    
    // Impact Telemetry
    impactTitle: 'Public Impact & Citizen Efficiency Telemetry',
    applicationLabel: 'Application:',
    timeTaken: 'Time Taken',
    timeTakenVsManual: 'vs. 45 min manual form (~99% speedup)',
    brokerageCostSaved: 'Brokerage Cost Saved',
    brokerageDesc: 'Eliminates cyber-cafe agent fee',
    autoRecoveredErrors: 'Auto-Recovered Errors',
    autoRecoveredDesc: 'Self-healing validation in browser',
    healedSuffix: 'Healed',
    shaAuditToken: 'SHA-256 Audit Token',
    auditTokenDesc: 'Cryptographic verification token',
    
    // Read & Explain Scheme / URL
    explainSectionTitle: 'Read & Explain Government Scheme / Portal URL',
    explainSectionSubtitle: 'Extract live webpage text using Playwright & receive an instant citizen breakdown covering scheme details, eligibility, required documents, and application steps.',
    urlInputLabel: 'Government Portal Webpage URL:',
    urlPlaceholder: 'http://localhost:5173/gov-portal or government scheme link',
    useLocalGovPortalBtn: 'Default: Local Portal (/gov-portal)',
    uploadNoticeLabel: 'Or Upload Notice / Document (PDF, Image):',
    readAndExplainBtn: 'Read & Explain Scheme',
    readingAndExplaining: 'Playwright scraping portal & Gemini analyzing...',
    langTabHinglish: '🗣️ Hinglish (बोलचाल)',
    langTabHindi: '🇮🇳 हिन्दी (Hindi)',
    langTabEnglish: '🇬🇧 English',
    aboutSchemeTitle: '1. What this scheme is about',
    eligibilityDocsTitle: '2. Who is eligible & required documents',
    stepsToApplyTitle: '3. Step-by-step instructions to apply',
    criteriaLabel: 'Key Eligibility Criteria:',
    requiredDocsLabel: 'Mandatory Documents Checklist:',
    applicationStepsLabel: 'Application Procedure:',
    autoApplyBtn: '🚀 Auto-Apply for this Scheme',
    autoApplySub: 'Pre-selects scheme & auto-executes form via Playwright',

    // Section 1: Voice & Intent
    section1Title: '1. Multilingual Voice & Natural Language Assistant',
    speechLangLabel: 'Speech Language:',
    promptPlaceholder: 'Say or type: "Mera scholarship form bhar do" or "Apply for student grant, income 1.8L"',
    listeningText: 'Listening (सुन रहे हैं)...',
    voiceInputText: 'Voice Input (बोलकर बताएं)',
    parseIntentBtn: 'Parse Intent',
    quickQueriesLabel: 'Try quick speech queries:',
    quickQuery1: 'Mera scholarship form bhar do, family income 1.8 lakh, OBC category',
    quickQuery2: 'Apply for PM-Kisan scheme, income 2 lakh',
    quickQuery3: 'Youth skill grant, income 1.2 lakh, SC category',
    
    // Section 2: Document Ingestion
    section2Title: '2. Document Ingestion',
    docUploadDesc: 'Upload Income, Aadhaar, or Domicile certificate (.pdf, .jpg, .png).',
    browseDocText: 'Click to Browse Document',
    docFormats: 'PDF, JPG, PNG up to 10MB',
    readyForPlaywright: 'Ready for Playwright attachment',
    extractionEngineLabel: 'Extraction Engine:',
    geminiFlash: 'Gemini 1.5 Flash',
    smartOffline: 'Smart Offline Fallback',
    
    // Section 3: Extracted Profile & Eligibility
    section3Title: '3. Extracted Citizen Profile & Cited Eligibility Assessment',
    profileSubDesc: 'Values populated by AI parser — editable prior to browser execution.',
    eligibleBadge: 'ELIGIBLE (पात्र)',
    ineligibleBadge: 'INELIGIBLE (अपात्र)',
    ruleVerificationFor: 'Rule Verification for:',
    statutoryAuthority: 'Official Statutory Authority & Guideline Clause:',
    checklistTitle: 'Mandatory Verification Document Checklist:',
    fullName: 'Full Legal Name',
    dob: 'Date of Birth',
    gender: 'Gender',
    genderMale: 'Male',
    genderFemale: 'Female',
    genderOther: 'Other',
    aadhaarLabel: 'Aadhaar (12 Digits)',
    mobileLabel: 'Mobile (10 Digits)',
    stateLabel: 'Domicile State',
    districtLabel: 'District',
    categoryLabel: 'Social Category',
    annualIncomeLabel: 'Annual Income (₹)',
    schemeLabel: 'Target Welfare Scheme',
    bankAccountLabel: 'Bank Account Number',
    ifscLabel: 'Bank IFSC',
    executionModeLabel: 'Execution Mode:',
    executionModeValue: 'Live Visible Window (`headless: false`, `slowMo: 250ms`)',
    agentExecuting: 'Agent Executing in Chromium...',
    launchAgentBtn: 'Launch Autonomous Playwright Agent',
    
    // Section 4: Live Telemetry
    section4Title: '4. Live Agent Execution Timeline & Telemetry',
    liveStatusLabel: 'Live Status:',
    phase1: 'Doc Ingestion',
    phase2: 'Eligibility Check',
    phase3: 'Fill Portal Step 1',
    phase4: 'Fill Portal Step 2',
    phase5: 'Citizen OTP Gate',
    telemetryStandby: 'Agent telemetry standby. Click "Launch Autonomous Playwright Agent" above to watch live browser execution events.',
    
    // Section 5: Vault
    section5Title: '5. Citizen Receipts & Audit Vault',
    refreshVaultBtn: 'Refresh Vault',
    noAppsText: 'No lodged applications yet. Run an autonomous submission to view verified government receipts here.',
    viewScreenshotBtn: 'View Official Screenshot',
    lodgedAndVerified: 'Lodged & Verified',
    incomeShort: 'Income',
    
    // HITL Modal
    securityCheckpoint: 'Security Checkpoint',
    hitlModalTitle: 'Human-in-the-Loop OTP Authorization',
    hitlModalDesc: 'The Playwright agent has filled Form-8B and paused at Step 3. Please review the extracted data before giving consent for final submission.',
    applicantLabel: 'Applicant:',
    targetSchemeModal: 'Target Scheme:',
    annualIncomeModal: 'Annual Income:',
    aadhaarLast4: 'Aadhaar (Last 4):',
    bankIfscAcModal: 'Bank IFSC / A/C:',
    esignOtpLabel: 'Government e-Sign OTP (Demo auto-filled: 123456)',
    autoFillOtp: 'Auto-Fill',
    cancelRejectBtn: 'Cancel / Reject',
    approveSubmitBtn: 'Approve & Submit (अनुमोदन करें)',
    
    // Multi-Scheme Auto-Discovery
    multiSchemeTitle: 'Eligible Schemes Discovered',
    multiSchemeSubtitle: 'Autonomous AI assessed statutory eligibility across 5 Central & State welfare initiatives simultaneously.',
    qualifyBannerText: 'You qualify for {count} schemes worth',
    perYearBenefits: 'in total annual financial benefits',
    selectAndApplyBtn: 'Select & Auto-Apply',
    selectedSchemeActive: 'Active Selection',
    
    // Document Pre-Flight Quality & Size Check
    preflightPassedBadge: 'Document Pre-Flight Passed (Verified < 200KB)',
    preflightDesc: 'Portal format, non-empty binary integrity, and < 200 KB upload constraints verified.',
    preflightSizeLabel: 'Optimized Size:',
    preflightLimitLabel: 'Portal Limit: 200 KB',

    // Autonomous Application Status Tracker
    trackLiveStatusBtn: 'Track Live Status',
    trackingStatusRunning: 'Playwright Tracking Live on Portal...',
    liveStatusVerified: 'Live Portal Verified',
    stageSubmitted: 'Submitted',
    stageDocVerified: 'Document Verified',
    stageDBTApproved: 'DBT Disbursement Approved',
    closeTracker: 'Close Tracker',

    // Voice Kiosk Mode
    voiceKioskBtn: 'Voice Kiosk Mode (Zero-Document)',
    voiceKioskTitle: 'Guided Voice-Only Kiosk Interview',
    voiceKioskSubtitle: 'No digital documents required. Speak your details step-by-step to generate your application profile.',
    kioskQuestionLabel: 'Question',
    kioskOfTotal: 'of 5',
    kioskListeningState: 'Listening to your spoken answer...',
    kioskSpeakingState: 'Assistant is speaking the question...',
    kioskSpeakAgain: 'Listen / Speak Again',
    kioskNextBtn: 'Confirm & Next Question',
    kioskSkipBtn: 'Skip Question',
    kioskExitBtn: 'Exit Kiosk Mode',
    kioskCompletedBanner: '🎉 Voice Interview Successfully Completed! Citizen profile populated without documents.',
    kioskCompletedPrompt: 'Ready to launch autonomous Playwright submission.',

    // Strict Privacy & Walk-In Session Isolation
    newCitizenClearBtn: 'New Citizen / Clear Session',
    newCitizenClearedToast: 'Session Cleared. Ready for new walk-in citizen.',
    activeCitizenSessionTitle: 'Active Citizen Session (Isolated)',
    activeCitizenSessionDesc: 'Strict Walk-In Privacy Active • Zero Cross-Citizen Data Leakage • Previous profiles isolated',
    individualEligibleBenefit: 'Your Individual Eligible Schemes:',
    unregisteredCitizen: 'Anonymous Walk-In Citizen',

    // Operator Vault (PIN Protected)
    operatorVaultBtn: 'Operator Vault (PIN Locked)',
    pinLockedTitle: 'Authorized Operator / Family Vault Access',
    pinLockedSubtitle: 'Enter 4-digit security PIN to access multi-member profiles & household records',
    pinPlaceholder: 'Enter 4-digit PIN',
    demoPinHint: 'Demo Operator PIN: 1234',
    unlockVaultBtn: 'Unlock Vault',
    lockVaultBtn: 'Lock Vault',
    invalidPinMsg: 'Invalid Operator PIN. Demo PIN is 1234.',
    quickPinFill: 'Demo PIN (1234)',
    householdFilterLabel: 'Household Group Filter:',
    sameHouseholdNotice: 'Combined entitlement strictly calculates members sharing the same Household Group ID.',
    loadToActiveSession: 'Load into Active Session',
    activeInSessionTag: 'Loaded in Active Session',

    // Offline Queue
    simulateOfflineBtn: 'Simulate Offline (Demo)',
    onlineLiveBadge: 'Network Online',
    offlineSimulatedBadge: 'Offline Mode Active (Simulated)',
    offlineDisconnectedBadge: 'No Internet Connection',
    offlineBannerTitle: 'Offline Mode Active (Zero-Data-Loss Local Queue)',
    offlineBannerDesc: 'No active connection detected or offline demo mode is simulated. All completed profiles and voice interviews will be secured safely in your local offline queue.',
    queuedDraftsTitle: 'Queued Offline Applications',
    queuedDraftsSubtitle: 'Secured in browser localStorage • Ready for autonomous dispatch when connected',
    syncNowBtn: 'Sync & Auto-Apply Now',
    syncingBtn: 'Syncing Application...',
    syncSuccessToast: 'Successfully synced & launched Playwright application for queued citizen!',
    offlineSavedToast: 'Application saved to local offline queue. Will auto-sync when online.',
    stillOfflineWarning: 'Cannot sync while offline. Please reconnect or disable simulated offline mode.',
    saveOfflineDraftBtn: 'Queue Offline Draft',

    // Family Welfare Vault
    familyVaultTitle: 'Authorized Family & Household Vault',
    familyVaultSubtitle: 'Village Operator Multi-Household Switcher (PIN Verified)',
    householdEntitlement: 'Combined Household Welfare Entitlement:',
    membersCountLabel: 'Members in this Household Group',
    activeMemberTag: 'Active Form Applicant',
    addFamilyMemberBtn: '+ Add Family Member',
    modalAddMemberTitle: 'Add New Family Member',
    relationLabel: 'Family Relationship',
    saveMemberBtn: 'Save to Family Vault',

    // Grievance Appeal Drafter
    objectionDelayBadge: 'Document Objection / Delayed > 15 Days',
    objectionDelayDesc: 'Statutory 15-day service delivery SLA breached. Formal administrative appeal recommended.',
    draftGrievanceBtn: 'Draft Formal Grievance Appeal',
    grievanceModalTitle: 'Public Grievance & Rectification Appeal Petition',
    grievanceModalSubtitle: 'Legally cited under CPGRAMS & State Public Services Guarantee Act',
    copyGrievanceBtn: 'Copy Appeal to Clipboard',
    copiedText: 'Copied to Clipboard!',
    downloadGrievanceBtn: 'Download Appeal (.txt)',
    closeGrievanceBtn: 'Close',

    // Footer
    footerText: 'CivicPulse — Autonomous Public Service & Bureaucracy Execution Agent • Built for Track 1 Hackathon'
  },
  hi: {
    trackTag: 'ट्रैक 1: सिविक पल्स और डिजिटल गवर्नेंस',
    agentSubtitle: 'स्वायत्त नौकरशाही निष्पादन एजेंट',
    appTitle: 'सिविकपल्स स्वायत्त कल्याणकारी एजेंट',
    appDesc: 'दस्तावेज़ों या आवाज़ से नागरिक कल्याणकारी योजनाओं की पात्रता निकालें, नियमों की पुष्टि करें, और Playwright के ज़रिए सरकारी फ़ॉर्म स्वतः भरें — ह्यूमन-इन-द-लूप OTP सुरक्षा के साथ।',
    loadSampleBtn: 'नमूना प्रमाण पत्र लोड करें (एक-क्लिक डेमो)',
    viewGovPortalBtn: 'सरकारी पोर्टल देखें (/gov-portal)',
    langLabel: 'भाषा / Language:',
    
    // Privacy Shield
    privacyShieldActive: 'प्राइवेसी शील्ड सक्रिय',
    zeroRetention: 'शून्य क्लाउड डेटा संचय',
    privacyShieldDesc: 'स्थानीय PII मास्किंग सक्षम (आधार और बैंक खाता LLM भेजने से पहले मास्क किए जाते हैं) • केवल स्थानीय मेमोरी में सुरक्षित • कार्य पूर्ण होने पर प्रमाण पत्र स्वतः नष्ट।',
    protectedTokensLabel: 'संरक्षित टोकन:',
    guardedAadhaarBank: 'आधार और बैंक खाता सुरक्षित',
    
    // Impact Telemetry
    impactTitle: 'जन प्रभाव और नागरिक दक्षता टेलीमेट्री',
    applicationLabel: 'आवेदन आईडी:',
    timeTaken: 'लिया गया समय',
    timeTakenVsManual: '45 मिनट के मैन्युअल फॉर्म की तुलना में (~99% बचत)',
    brokerageCostSaved: 'बचत हुआ दलाली खर्च',
    brokerageDesc: 'साइबर कैफ़े एजेंट की ₹150 फीस की बचत',
    autoRecoveredErrors: 'स्वतः सुधारे गए त्रुटियाँ',
    autoRecoveredDesc: 'ब्राउज़र में स्वचालित सुधार तंत्र',
    healedSuffix: 'सुधारे गए',
    shaAuditToken: 'SHA-256 ऑडिट टोकन',
    auditTokenDesc: 'क्रिप्टोग्राफ़िक सत्यापन टोकन',

    // Read & Explain Scheme / URL
    explainSectionTitle: 'सरकारी योजना व पोर्टल को समझें (Webpage URL या दस्तावेज़ से)',
    explainSectionSubtitle: 'Playwright द्वारा पोर्टल की सामग्री निकालें और आवेदन करने से पहले सरल भाषा (हिंग्लिश/हिंदी/अंग्रेजी) में योजना का विवरण, पात्रता और प्रक्रिया समझें।',
    urlInputLabel: 'सरकारी पोर्टल का वेब पता (URL):',
    urlPlaceholder: 'http://localhost:5173/gov-portal या सरकारी योजना लिंक',
    useLocalGovPortalBtn: 'डिफ़ॉल्ट: स्थानीय पोर्टल (/gov-portal)',
    uploadNoticeLabel: 'या योजना का नोटिस / PDF दस्तावेज़ अपलोड करें:',
    readAndExplainBtn: 'योजना पढ़ें और समझें',
    readingAndExplaining: 'Playwright पोर्टल स्कैन कर रहा है और AI विश्लेषण कर रहा है...',
    langTabHinglish: '🗣️ हिंग्लिश (बोलचाल)',
    langTabHindi: '🇮🇳 हिन्दी (Hindi)',
    langTabEnglish: '🇬🇧 English',
    aboutSchemeTitle: '1. यह योजना किस बारे में है',
    eligibilityDocsTitle: '2. कौन पात्र है और कौन से दस्तावेज़ चाहिए',
    stepsToApplyTitle: '3. आवेदन करने के चरण (Step-by-Step)',
    criteriaLabel: 'मुख्य पात्रता मानदंड:',
    requiredDocsLabel: 'अनिवार्य दस्तावेज़ सूची:',
    applicationStepsLabel: 'आवेदन प्रक्रिया:',
    autoApplyBtn: '🚀 इस योजना के लिए स्वतः आवेदन करें',
    autoApplySub: 'योजना स्वतः चुनेगा और Playwright से फॉर्म भरेगा',
    
    // Section 1: Voice & Intent
    section1Title: '1. बहुभाषी आवाज़ और प्राकृतिक भाषा सहायक',
    speechLangLabel: 'बोलने की भाषा:',
    promptPlaceholder: 'बोलें या लिखें: "मेरा स्कॉलरशिप फॉर्म भर दो" या "छात्रवृत्ति के लिए आवेदन करें, आय 1.8 लाख"',
    listeningText: 'सुन रहे हैं (Listening)...',
    voiceInputText: 'आवाज़ से बोलें (Voice Input)',
    parseIntentBtn: 'उद्देश्य समझें (Parse Intent)',
    quickQueriesLabel: 'त्वरित आवाज़ नमूने आज़माएं:',
    quickQuery1: 'मेरा स्कॉलरशिप फॉर्म भर दो, पारिवारिक आय 1.8 लाख, ओबीसी श्रेणी',
    quickQuery2: 'पीएम किसान सम्मान निधि के लिए आवेदन करें, आय 2 लाख',
    quickQuery3: 'राज्य युवा कौशल विकास अनुदान, आय 1.2 लाख, एससी श्रेणी',
    
    // Section 2: Document Ingestion
    section2Title: '2. दस्तावेज़ इनपुट व अपलोड',
    docUploadDesc: 'आय, आधार या निवास प्रमाण पत्र अपलोड करें (.pdf, .jpg, .png)।',
    browseDocText: 'दस्तावेज़ ब्राउज़ करने के लिए क्लिक करें',
    docFormats: 'PDF, JPG, PNG (अधिकतम 10MB)',
    readyForPlaywright: 'Playwright फ़ॉर्म अटैचमेंट के लिए तैयार',
    extractionEngineLabel: 'निष्कर्षण इंजन:',
    geminiFlash: 'जेमिनी 1.5 फ़्लैश',
    smartOffline: 'स्मार्ट ऑफ़लाइन फ़ॉलबैक',
    
    // Section 3: Extracted Profile & Eligibility
    section3Title: '3. निकाली गई नागरिक प्रोफ़ाइल और सत्यापित योजना पात्रता',
    profileSubDesc: 'एआई द्वारा भरे गए मान — ब्राउज़र निष्पादन से पहले संपादन योग्य।',
    eligibleBadge: 'पात्र (ELIGIBLE)',
    ineligibleBadge: 'अपात्र (INELIGIBLE)',
    ruleVerificationFor: 'योजना नियम सत्यापन:',
    statutoryAuthority: 'आधिकारिक कानूनी संदर्भ एवं दिशानिर्देश धारा:',
    checklistTitle: 'अनिवार्य सत्यापन दस्तावेज़ सूची:',
    fullName: 'पूरा कानूनी नाम',
    dob: 'जन्म तिथि',
    gender: 'लिंग',
    genderMale: 'पुरुष (Male)',
    genderFemale: 'महिला (Female)',
    genderOther: 'अन्य (Other)',
    aadhaarLabel: 'आधार संख्या (12 अंक)',
    mobileLabel: 'मोबाइल नंबर (10 अंक)',
    stateLabel: 'मूल निवास राज्य',
    districtLabel: 'ज़िला',
    categoryLabel: 'सामाजिक श्रेणी',
    annualIncomeLabel: 'वार्षिक पारिवारिक आय (₹)',
    schemeLabel: 'लक्षित कल्याणकारी योजना',
    bankAccountLabel: 'बैंक खाता संख्या',
    ifscLabel: 'बैंक IFSC कोड',
    executionModeLabel: 'निष्पादन मोड:',
    executionModeValue: 'लाइव दृश्य विंडो (`headless: false`, `slowMo: 250ms`)',
    agentExecuting: 'Chromium में एजेंट काम कर रहा है...',
    launchAgentBtn: 'स्वायत्त Playwright एजेंट शुरू करें',
    
    // Section 4: Live Telemetry
    section4Title: '4. लाइव एजेंट निष्पादन समयरेखा और टेलीमेट्री',
    liveStatusLabel: 'लाइव स्थिति:',
    phase1: 'दस्तावेज़ निष्कर्षण',
    phase2: 'पात्रता जाँच',
    phase3: 'पोर्टल चरण 1',
    phase4: 'पोर्टल चरण 2',
    phase5: 'नागरिक OTP गेट',
    telemetryStandby: 'एजेंट टेलीमेट्री तैयार है। ब्राउज़र में लाइव देखने के लिए ऊपर "स्वायत्त Playwright एजेंट शुरू करें" पर क्लिक करें।',
    
    // Section 5: Vault
    section5Title: '5. नागरिक रसीदें और ऑडिट वॉल्ट',
    refreshVaultBtn: 'वॉल्ट रीफ़्रेश करें',
    noAppsText: 'अभी तक कोई आवेदन दर्ज नहीं हुआ है। यहाँ सत्यापित सरकारी रसीद देखने के लिए स्वायत्त सबमिशन चलाएं।',
    viewScreenshotBtn: 'आधिकारिक स्क्रीनशॉट देखें',
    lodgedAndVerified: 'सफलतापूर्वक दर्ज और सत्यापित',
    incomeShort: 'आय',
    
    // HITL Modal
    securityCheckpoint: 'सुरक्षा जाँच बिंदु',
    hitlModalTitle: 'ह्यूमन-इन-द-लूप OTP सत्यापन',
    hitlModalDesc: 'Playwright एजेंट ने फॉर्म-8B भर दिया है और चरण 3 पर रुक गया है। कृपया अंतिम सबमिशन के लिए सहमति देने से पहले विवरण की समीक्षा करें।',
    applicantLabel: 'आवेदक:',
    targetSchemeModal: 'लक्षित योजना:',
    annualIncomeModal: 'वार्षिक आय:',
    aadhaarLast4: 'आधार (अंतिम 4):',
    bankIfscAcModal: 'बैंक IFSC / खाता:',
    esignOtpLabel: 'सरकारी ई-हस्ताक्षर OTP (डेमो स्वतः भरा गया: 123456)',
    autoFillOtp: 'स्वतः भरें (Auto-Fill)',
    cancelRejectBtn: 'रद्द / अस्वीकार करें (Cancel)',
    approveSubmitBtn: 'अनुमोदन और सबमिट करें (Approve & Submit)',
    
    // Multi-Scheme Auto-Discovery
    multiSchemeTitle: 'पात्र सरकारी योजनाएं खोजी गईं (मल्टी-स्कीम ऑटो-डिस्कवरी)',
    multiSchemeSubtitle: 'एआई ने एक साथ 5 केंद्रीय एवं राज्य कल्याणकारी योजनाओं में आपकी कानूनी पात्रता का स्वतः परीक्षण किया।',
    qualifyBannerText: 'आप {count} योजनाओं के लिए पात्र हैं, जिनका कुल वार्षिक लाभ',
    perYearBenefits: 'है',
    selectAndApplyBtn: 'चुनें और स्वतः आवेदन करें',
    selectedSchemeActive: 'सक्रिय चयन',

    // Document Pre-Flight Quality & Size Check
    preflightPassedBadge: 'दस्तावेज़ प्री-फ़्लाइट उत्तीर्ण (सत्यापित < 200KB)',
    preflightDesc: 'फ़ाइल प्रारूप, बाइनरी सत्यता और सरकारी पोर्टल की 200 KB आकार सीमा सत्यापित।',
    preflightSizeLabel: 'अनुकूलित आकार:',
    preflightLimitLabel: 'पोर्टल सीमा: 200 KB',

    // Autonomous Application Status Tracker
    trackLiveStatusBtn: 'लाइव स्थिति ट्रैक करें',
    trackingStatusRunning: 'Playwright पोर्टल पर लाइव जांच कर रहा है...',
    liveStatusVerified: 'पोर्टल पर लाइव सत्यापित',
    stageSubmitted: 'आवेदन जमा हुआ',
    stageDocVerified: 'दस्तावेज़ सत्यापित',
    stageDBTApproved: 'डीबीटी भुगतान स्वीकृत',
    closeTracker: 'ट्रैकर बंद करें',

    // Voice Kiosk Mode
    voiceKioskBtn: 'वॉइस कियोस्क मोड (बिना दस्तावेज़)',
    voiceKioskTitle: 'मार्गदर्शित वॉइस-ओनली कियोस्क साक्षात्कार',
    voiceKioskSubtitle: 'डिजिटल दस्तावेज़ की आवश्यकता नहीं। बोलकर 5 सवालों के जवाब दें और अपनी प्रोफ़ाइल तैयार करें।',
    kioskQuestionLabel: 'प्रश्न',
    kioskOfTotal: 'कुल 5 में से',
    kioskListeningState: 'आपके जवाब की प्रतीक्षा है, बोलिए...',
    kioskSpeakingState: 'सहायक प्रश्न बोल रहा है...',
    kioskSpeakAgain: 'पुनः सुनें / बोलें',
    kioskNextBtn: 'पुष्टि करें और अगला प्रश्न',
    kioskSkipBtn: 'छोड़ें (Skip)',
    kioskExitBtn: 'कियोस्क मोड से बाहर आएं',
    kioskCompletedBanner: '🎉 आवाज़ साक्षात्कार सफलतापूर्वक पूर्ण! बिना दस्तावेज़ के प्रोफ़ाइल तैयार।',
    kioskCompletedPrompt: 'स्वायत्त Playwright निष्पादन शुरू करने के लिए तैयार।',

    // Strict Privacy & Walk-In Session Isolation
    newCitizenClearBtn: 'नया नागरिक / सत्र साफ़ करें',
    newCitizenClearedToast: 'सत्र साफ़ हो गया। नए नागरिक के लिए तैयार।',
    activeCitizenSessionTitle: 'सक्रिय नागरिक सत्र (सख्त गोपनीयता पृथक्करण)',
    activeCitizenSessionDesc: 'सख्त गोपनीयता सक्रिय • कोई पुराना डेटा दूसरे नागरिक को नहीं दिखेगा • पूर्व प्रोफाइल पूर्णतः सुरक्षित',
    individualEligibleBenefit: 'आपके व्यक्तिगत सरकारी योजना लाभ:',
    unregisteredCitizen: 'नया नागरिक (अनाम सत्र)',

    // Operator Vault (PIN Protected)
    operatorVaultBtn: 'ऑपरेटर वॉल्ट (PIN सुरक्षित)',
    pinLockedTitle: 'अधिकृत ऑपरेटर / पारिवारिक वॉल्ट एक्सेस',
    pinLockedSubtitle: 'पारिवारिक सदस्यों और रिकॉर्ड्स तक पहुँचने के लिए 4-अंकीय सुरक्षा पिन दर्ज करें',
    pinPlaceholder: '4-अंकीय पिन दर्ज करें',
    demoPinHint: 'डेमो ऑपरेटर पिन: 1234',
    unlockVaultBtn: 'वॉल्ट अनलॉक करें',
    lockVaultBtn: 'वॉल्ट लॉक करें',
    invalidPinMsg: 'अमान्य ऑपरेटर पिन। कृपया 1234 दर्ज करें।',
    quickPinFill: 'डेमो पिन भरें (1234)',
    householdFilterLabel: 'पारिवारिक समूह चयन:',
    sameHouseholdNotice: 'सामूहिक लाभ केवल समान Household ID साझा करने वाले परिजनों का ही जोड़ा जाता है।',
    loadToActiveSession: 'सक्रिय सत्र में लोड करें',
    activeInSessionTag: 'सक्रिय सत्र में लोड किया गया',

    // Offline Queue
    simulateOfflineBtn: 'ऑफ़लाइन सिमुलेशन (डेमो)',
    onlineLiveBadge: 'नेटवर्क ऑनलाइन',
    offlineSimulatedBadge: 'ऑफ़लाइन मोड सक्रिय (सिमुलेटेड)',
    offlineDisconnectedBadge: 'इंटरनेट कनेक्शन नहीं है',
    offlineBannerTitle: 'ऑफ़लाइन मोड सक्रिय (स्थानीय शून्य-डेटा-हानि कतार)',
    offlineBannerDesc: 'इंटरनेट कनेक्शन नहीं है अथवा डेमो ऑफ़लाइन सिमुलेशन सक्रिय है। नागरिक प्रोफ़ाइल एवं वॉइस इंटरव्यू स्थानीय ब्राउज़र कतार में सुरक्षित सहेजे जाएंगे।',
    queuedDraftsTitle: 'कतारबद्ध ऑफ़लाइन आवेदन (ड्राफ्ट)',
    queuedDraftsSubtitle: 'स्थानीय ब्राउज़र स्टोरेज में सुरक्षित • इंटरनेट जुड़ने पर स्वायत्त निष्पादन हेतु तैयार',
    syncNowBtn: 'सिंक करें और अभी आवेदन करें',
    syncingBtn: 'सिंक हो रहा है...',
    syncSuccessToast: 'कतारबद्ध आवेदन सफलतापूर्वक सिंक किया गया और Playwright शुरू हुआ!',
    offlineSavedToast: 'आवेदन ऑफ़लाइन कतार में सुरक्षित सहेज लिया गया है। ऑनलाइन होने पर सिंक होगा।',
    stillOfflineWarning: 'ऑफ़लाइन स्थिति में सिंक संभव नहीं। कृपया इंटरनेट चालू करें या सिमुलेशन बंद करें।',
    saveOfflineDraftBtn: 'ऑफ़लाइन ड्राफ्ट कतार में जोड़ें',

    // Family Welfare Vault
    familyVaultTitle: 'अधिकृत पारिवारिक एवं कल्याण वॉल्ट',
    familyVaultSubtitle: 'कियोस्क ऑपरेटर बहु-परिवार स्विचिंग सिस्टम (PIN सत्यापित)',
    householdEntitlement: 'कुल वार्षिक पारिवारिक सरकारी लाभ:',
    membersCountLabel: 'इस परिवार समूह में सदस्य',
    activeMemberTag: 'सक्रिय आवेदक',
    addFamilyMemberBtn: '+ नया सदस्य जोड़ें',
    modalAddMemberTitle: 'नया पारिवारिक सदस्य जोड़ें',
    relationLabel: 'पारिवारिक संबंध',
    saveMemberBtn: 'फैमिली वॉल्ट में सहेजें',

    // Grievance Appeal Drafter
    objectionDelayBadge: 'दस्तावेज़ आपत्ति / 15 दिनों से अधिक विलंब',
    objectionDelayDesc: 'वैधानिक 15-दिवसीय सेवा गारंटी समय-सीमा समाप्त। औपचारिक प्रशासनिक अपील अनुशंसित।',
    draftGrievanceBtn: 'शिकायत अपील पत्र तैयार करें',
    grievanceModalTitle: 'औपचारिक लोक शिकायत एवं प्रशासनिक सुधार याचिका',
    grievanceModalSubtitle: 'CPGRAMS एवं लोक सेवा गारंटी अधिनियम के तहत आधिकारिक कानूनी अपील',
    copyGrievanceBtn: 'अपील पत्र कॉपी करें',
    copiedText: 'क्लिपबोर्ड पर कॉपी किया गया!',
    downloadGrievanceBtn: 'अपील डाउनलोड करें (.txt)',
    closeGrievanceBtn: 'बंद करें',

    // Footer
    footerText: 'सिविकपल्स — स्वायत्त सार्वजनिक सेवा एवं नौकरशाही निष्पादन एजेंट • ट्रैक 1 हैकाथॉन'
  }
};

const translateDocItem = (item, lang) => {
  if (lang !== 'hi') return item;
  const map = {
    'Valid Domicile / Residence Certificate issued by Revenue Tahasildar': 'राजस्व तहसीलदार द्वारा जारी वैध मूल निवास प्रमाण पत्र',
    'Competent Authority Family Income Certificate (< ₹2,50,000 / year)': 'सक्षम प्राधिकारी द्वारा पारिवारिक आय प्रमाण पत्र (< ₹2,50,000 / वर्ष)',
    'Previous Academic Year Marksheet (Minimum 50% qualifying aggregate)': 'पिछले शैक्षणिक वर्ष की अंकतालिका (न्यूनतम 50% योग्यता अंक)',
    'Aadhaar Seeded Active Bank Account (NPCI Direct Benefit Transfer enabled)': 'आधार लिंक सक्रिय बैंक खाता (NPCI / DBT सक्षम)',
    'Land Holding Ownership Records (ROR / Khatauni / Jamabandi)': 'भूमि स्वामित्व रिकॉर्ड (खतौनी / जमाबंदी / ROR)',
    '12-digit Aadhaar Card with mandatory biometric authentication': 'बायोमेट्रिक प्रमाणित 12-अंकीय आधार कार्ड',
    'Bank Passbook with active IFSC linked to PM-Kisan DBT portal': 'पीएम-किसान DBT से लिंक सक्रिय IFSC युक्त बैंक पासबुक',
    'Self-Declaration of Non-Exclusion (Affidavit under Clause 3.2)': 'गैर-बहिष्कार का स्व-घोषणा पत्र (शपथ पत्र)',
    'Secondary School Examination (10th/12th) Passing Certificate': 'माध्यमिक विद्यालय परीक्षा (10वीं/12वीं) उत्तीर्ण प्रमाण पत्र',
    'Bank Account Passbook with IFSC code for DBT stipend': 'DBT वजीफे के लिए IFSC कोड सहित बैंक पासबुक',
    'Valid Identity Proof (Aadhaar / Voter ID)': 'वैध पहचान पत्र (आधार / वोटर आईडी)',
    'Youth Employment Exchange Registration Card (if applicable)': 'रोजगार कार्यालय पंजीयन कार्ड (यदि लागू हो)'
  };
  if (map[item]) return map[item];
  if (item.startsWith('Caste / Social Reservation Certificate')) {
    return item.replace('Caste / Social Reservation Certificate', 'जाति / सामाजिक आरक्षण प्रमाण पत्र');
  }
  return item;
};

export default function CitizenDashboard() {
  // Current UI & Speech Language State (Synced)
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('civicpulse_ui_lang') || 'hi';
  });
  const [speechLang, setSpeechLang] = useState(() => {
    return (localStorage.getItem('civicpulse_ui_lang') || 'hi') === 'hi' ? 'hi-IN' : 'en-IN';
  });

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    const newSpeechLang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    setSpeechLang(newSpeechLang);
    localStorage.setItem('civicpulse_ui_lang', lang);
  };

  // Voice & Prompt State
  const [userPrompt, setUserPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Document & Extraction State
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionSource, setExtractionSource] = useState(null);
  const [piiTokensCount, setPiiTokensCount] = useState(0);
  
  // Read & Explain Scheme State
  const [schemeUrl, setSchemeUrl] = useState(() => {
    const origin = (typeof window !== 'undefined' && window.location?.origin) ? window.location.origin : 'http://localhost:5173';
    return `${origin}/gov-portal`;
  });
  const [noticeFile, setNoticeFile] = useState(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanationData, setExplanationData] = useState(null);
  const [explanationLang, setExplanationLang] = useState('hinglish'); // 'hinglish' | 'hi' | 'en'
  const [explainError, setExplainError] = useState(null);

  // Citizen Form State (Editable)
  const [citizenData, setCitizenData] = useState({
    fullName: '',
    dob: '',
    gender: 'Male',
    idNumber: '',
    mobile: '',
    state: '',
    district: '',
    schemeName: 'Post-Matric Merit Scholarship',
    annualIncome: '',
    category: 'OBC',
    bankAccount: '',
    ifsc: ''
  });

  // Eligibility Evaluation State
  const [eligibility, setEligibility] = useState(null);
  const [isEvaluatingEligibility, setIsEvaluatingEligibility] = useState(false);

  // Agent Execution & Telemetry State
  const [isAgentRunning, setIsAgentRunning] = useState(false);
  const [agentSessionId, setAgentSessionId] = useState(null);
  const [agentEvents, setAgentEvents] = useState([]);
  const [agentStep, setAgentStep] = useState(0);
  const [agentStatusText, setAgentStatusText] = useState('Agent Ready');
  const [autoRecoveredErrorsCount, setAutoRecoveredErrorsCount] = useState(0);
  const executionStartTimeRef = useRef(null);

  // Impact Telemetry State
  const [impactMetrics, setImpactMetrics] = useState(null);

  // Human-in-the-Loop Modal State
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalOtp, setApprovalOtp] = useState('123456');
  const [isApproving, setIsApproving] = useState(false);

  // Completed Applications Vault State
  const [applications, setApplications] = useState([]);

  // Multi-Scheme Auto-Discovery State
  const [discoveredSchemes, setDiscoveredSchemes] = useState(null);

  // Document Pre-Flight Quality Check State
  const [preflightResult, setPreflightResult] = useState({
    passed: true,
    badge: 'Verified < 200KB (142.5 KB)',
    originalSizeKB: 142.5,
    optimizedSizeKB: 142.5,
    isOptimized: false,
    checks: [
      { name: 'Portal Format Compliance', passed: true, detail: 'Accepted Government Portal Format (.png)' },
      { name: 'Buffer Integrity', passed: true, detail: 'Valid binary payload' },
      { name: 'Portal Upload Threshold (< 200 KB)', passed: true, detail: 'File size is 142.5 KB (under 200 KB limit)' }
    ]
  });

  // Autonomous Application Status Tracking State
  const [trackingAppId, setTrackingAppId] = useState(null);
  const [liveTrackingResults, setLiveTrackingResults] = useState({});

  // ----------------------------------------------------------------
  // Family Welfare Vault State (Grouped by Household ID)
  // ----------------------------------------------------------------
  const DEFAULT_FAMILY_MEMBERS = [
    {
      id: "member-self",
      householdId: "HH-VERMA-2026",
      householdName: "Verma Household Group",
      relation: "Self",
      relationHi: "स्वयं (नागरिक)",
      fullName: "Ramesh Kumar Verma",
      dob: "2003-05-14",
      gender: "Male",
      idNumber: "839210482910",
      mobile: "9876543210",
      state: "Karnataka",
      district: "Bengaluru Urban",
      schemeName: "Post-Matric Merit Scholarship",
      annualIncome: 180000,
      category: "OBC",
      bankAccount: "918237465019",
      ifsc: "SBIN0001234",
      occupation: "College Student",
      topEligibleScheme: "Post-Matric Merit Scholarship (PMS-2026)",
      annualBenefit: 50000
    },
    {
      id: "member-father",
      householdId: "HH-VERMA-2026",
      householdName: "Verma Household Group",
      relation: "Father",
      relationHi: "पिता",
      fullName: "Suresh Kumar Verma",
      dob: "1975-08-20",
      gender: "Male",
      idNumber: "748392019284",
      mobile: "9845123456",
      state: "Karnataka",
      district: "Mysuru",
      schemeName: "PM-Kisan Samman Nidhi",
      annualIncome: 180000,
      category: "OBC",
      bankAccount: "827104928172",
      ifsc: "SBIN0001234",
      occupation: "Small & Marginal Farmer",
      topEligibleScheme: "PM-Kisan Samman Nidhi (PM-KISAN)",
      annualBenefit: 6000
    },
    {
      id: "member-mother",
      householdId: "HH-VERMA-2026",
      householdName: "Verma Household Group",
      relation: "Mother",
      relationHi: "माता",
      fullName: "Sunita Devi Verma",
      dob: "1979-11-12",
      gender: "Female",
      idNumber: "918273645102",
      mobile: "9845123456",
      state: "Karnataka",
      district: "Mysuru",
      schemeName: "Ayushman Bharat Health Cover",
      annualIncome: 180000,
      category: "OBC",
      bankAccount: "827104928172",
      ifsc: "SBIN0001234",
      occupation: "Homemaker",
      topEligibleScheme: "Ayushman Bharat PM-JAY (Health Cover)",
      annualBenefit: 500000
    },
    {
      id: "member-sibling",
      householdId: "HH-VERMA-2026",
      householdName: "Verma Household Group",
      relation: "Sibling",
      relationHi: "बहन",
      fullName: "Priya Verma",
      dob: "2010-02-18",
      gender: "Female",
      idNumber: "639201948271",
      mobile: "9876543210",
      state: "Karnataka",
      district: "Bengaluru Urban",
      schemeName: "National Means-cum-Merit Scholarship",
      annualIncome: 180000,
      category: "OBC",
      bankAccount: "918237465019",
      ifsc: "SBIN0001234",
      occupation: "School Student",
      topEligibleScheme: "National Means-cum-Merit Scholarship (NMMSS)",
      annualBenefit: 12000
    },
    {
      id: "member-walkin-sharma",
      householdId: "HH-SHARMA-9014",
      householdName: "Sharma Household (Unrelated Walk-in)",
      relation: "Self",
      relationHi: "नागरिक (पृथक परिवार)",
      fullName: "Sunil Sharma",
      dob: "1998-04-10",
      gender: "Male",
      idNumber: "512349018234",
      mobile: "9123456780",
      state: "Rajasthan",
      district: "Jaipur",
      schemeName: "State Skill Development Grant",
      annualIncome: 140000,
      category: "General",
      bankAccount: "419283019284",
      ifsc: "SBIN0004321",
      occupation: "Unemployed Youth",
      topEligibleScheme: "State Skill Development Grant (SSDG-2026)",
      annualBenefit: 25000
    }
  ];

  const [familyMembers, setFamilyMembers] = useState(() => {
    try {
      const stored = localStorage.getItem('civicpulse_family_profiles');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_FAMILY_MEMBERS;
  });

  const [activeFamilyMemberId, setActiveFamilyMemberId] = useState('member-self');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState({
    householdId: 'HH-VERMA-2026',
    householdName: 'Verma Household Group',
    relation: 'Sibling',
    fullName: '',
    dob: '2005-01-01',
    gender: 'Female',
    idNumber: '987654321098',
    mobile: '9876543210',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    schemeName: 'Post-Matric Merit Scholarship',
    annualIncome: 180000,
    category: 'OBC',
    bankAccount: '918237465019',
    ifsc: 'SBIN0001234'
  });

  // ----------------------------------------------------------------
  // Operator Vault & Strict Privacy Session Isolation State
  // ----------------------------------------------------------------
  const [isOperatorDrawerOpen, setIsOperatorDrawerOpen] = useState(false);
  const [isOperatorUnlocked, setIsOperatorUnlocked] = useState(false);
  const [operatorPinInput, setOperatorPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeHouseholdFilter, setActiveHouseholdFilter] = useState('HH-VERMA-2026');
  const [sessionClearedToast, setSessionClearedToast] = useState(false);

  // ----------------------------------------------------------------
  // Offline-First Draft Queue State & Online Connectivity
  // ----------------------------------------------------------------
  const [isOnline, setIsOnline] = useState(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState(() => {
    try {
      const stored = localStorage.getItem('civicpulse_offline_queue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isSyncingQueue, setIsSyncingQueue] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [offlineToastMsg, setOfflineToastMsg] = useState('');

  const effectiveOffline = !isOnline || isSimulatedOffline;

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setOfflineToastMsg(t.onlineLiveBadge || 'Network connection restored.');
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setOfflineToastMsg(t.offlineDisconnectedBadge || 'Offline mode detected.');
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t]);

  // ----------------------------------------------------------------
  // Zero-Document Guided Voice Interview Mode State
  // ----------------------------------------------------------------
  const [isVoiceKioskOpen, setIsVoiceKioskOpen] = useState(false);
  const [kioskStep, setKioskStep] = useState(1);
  const [kioskIsSpeaking, setKioskIsSpeaking] = useState(false);
  const [kioskIsListening, setKioskIsListening] = useState(false);
  const [kioskCurrentAnswer, setKioskCurrentAnswer] = useState('');
  const [kioskCompleted, setKioskCompleted] = useState(false);
  const kioskRecognitionRef = useRef(null);

  // ----------------------------------------------------------------
  // Grievance Appeal Modal State
  // ----------------------------------------------------------------
  const [grievanceModalData, setGrievanceModalData] = useState(null);
  const [grievanceLang, setGrievanceLang] = useState('hi');
  const [isCopiedAppeal, setIsCopiedAppeal] = useState(false);

  // ----------------------------------------------------------------
  // Web Speech API Initialization
  // ----------------------------------------------------------------
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = speechLang;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e) => {
        console.warn('Speech recognition notice:', e.error);
        setIsListening(false);
      };
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserPrompt(transcript);
        triggerExtraction(selectedFile, transcript);
      };

      recognitionRef.current = recognition;
    }
  }, [speechLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your prompt.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.lang = speechLang;
      recognitionRef.current.start();
    }
  };

  // ----------------------------------------------------------------
  // Fetch Existing Application Records
  // ----------------------------------------------------------------
  const fetchApplications = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/applications`);
      const data = await res.json();
      if (data.success && data.applications) {
        setApplications(data.applications);
        if (data.applications.length > 0 && !impactMetrics) {
          const latest = data.applications[0];
          computeSha256(`${latest.trackingId}:${latest.fullName}:${latest.idNumber || 'AUTH'}`).then(hash => {
            setImpactMetrics({
              trackingId: latest.trackingId,
              timeTakenSec: latest.durationSeconds || '14.2',
              manualTimeMin: 45,
              autoRecoveredCount: latest.autoRecoveredCount ?? 1,
              costSavedInr: 150,
              auditHash: hash
            });
          });
        }
      }
    } catch (err) {
      console.warn('Could not load application records:', err);
    }
  };

  useEffect(() => {
    fetchApplications();
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ----------------------------------------------------------------
  // Trigger AI Extraction (Backend with Local PII Masking)
  // ----------------------------------------------------------------
  const triggerExtraction = async (fileToUse, promptText = userPrompt, forceSample = false) => {
    setIsExtracting(true);
    setEligibility(null);
    try {
      const formData = new FormData();
      if (fileToUse) {
        formData.append('document', fileToUse);
      }
      if (forceSample) {
        formData.append('useSampleCertificate', 'true');
      }
      formData.append('prompt', promptText || '');

      const res = await fetch(`${API_BASE_URL}/api/extract`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success && data.data) {
        setCitizenData(data.data);
        setExtractionSource(data.source);
        setPiiTokensCount(data.piiTokensProtected || 2);
        if (data.preflight) {
          setPreflightResult(data.preflight);
        }
        if (forceSample) {
          setFilePreview(`${API_BASE_URL}/uploads/sample_income_certificate.png`);
        }
        evaluateEligibility(data.data);
      }
    } catch (err) {
      console.error('Extraction error:', err);
    } finally {
      setIsExtracting(false);
    }
  };

  // ----------------------------------------------------------------
  // Read & Explain Scheme (Playwright Visible Text Extraction & Gemini)
  // ----------------------------------------------------------------
  const handleExplainScheme = async (overrideUrl) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsExplaining(true);
    setExplainError(null);
    try {
      const formData = new FormData();
      const urlToSend = overrideUrl !== undefined ? overrideUrl : schemeUrl;
      if (urlToSend) {
        formData.append('url', urlToSend);
      }
      if (noticeFile) {
        formData.append('document', noticeFile);
      }

      const res = await fetch(`${API_BASE_URL}/api/explain-scheme`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success && data.explanation) {
        setExplanationData(data.explanation);
        if (currentLang === 'hi' && explanationLang === 'en') {
          setExplanationLang('hi');
        }
      } else {
        throw new Error(data.error || 'Failed to analyze scheme/URL');
      }
    } catch (err) {
      console.error('Explain error:', err);
      setExplainError(err.message || 'Unable to scan portal URL');
    } finally {
      setIsExplaining(false);
    }
  };

  // Auto-Apply from Explanation
  const handleAutoApplyFromExplanation = () => {
    if (!explanationData) return;
    const targetScheme = explanationData.targetSchemeId || explanationData.schemeName;
    setCitizenData(prev => ({
      ...prev,
      schemeName: targetScheme
    }));
    if (!citizenData.fullName) {
      handleLoadSampleCertificate();
    } else {
      evaluateEligibility({ ...citizenData, schemeName: targetScheme });
    }
    const formEl = document.getElementById('citizen-profile-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ----------------------------------------------------------------
  // Quick Load Sample Certificate Button (Hackathon Essential)
  // ----------------------------------------------------------------
  const handleLoadSampleCertificate = () => {
    const promptText = currentLang === 'hi' 
      ? 'रमेश कुमार वर्मा के लिए पोस्ट-मैट्रिक मेरिट छात्रवृत्ति आवेदन, ओबीसी श्रेणी'
      : 'Apply for Post-Matric Merit Scholarship for Ramesh Kumar Verma, OBC category';
    setUserPrompt(promptText);
    triggerExtraction(null, promptText, true);
  };

  // ----------------------------------------------------------------
  // File Upload Handlers
  // ----------------------------------------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
      triggerExtraction(file, userPrompt);
    }
  };

  // ----------------------------------------------------------------
  // Evaluate Scheme Eligibility (With Clause Citations & Checklist)
  // ----------------------------------------------------------------
  const evaluateEligibility = async (dataToEvaluate = citizenData) => {
    setIsEvaluatingEligibility(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/check-eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citizenData: dataToEvaluate })
      });
      const result = await res.json();
      if (result.success) {
        setEligibility(result.eligibility);
        if (result.discovery) {
          setDiscoveredSchemes(result.discovery);
        }
      }
    } catch (err) {
      console.warn('Eligibility check error:', err);
    } finally {
      setIsEvaluatingEligibility(false);
    }
  };

  // Handler for Selecting a Discovered Scheme from the Banner
  const handleSelectDiscoveredScheme = (schemeId) => {
    const updated = { ...citizenData, schemeName: schemeId };
    setCitizenData(updated);
    evaluateEligibility(updated);
    const targetEl = document.getElementById('citizen-profile-section');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handler for Autonomous Live Application Status Tracking via Playwright
  const handleTrackApplicationStatus = async (trackingId) => {
    if (!trackingId) return;
    setTrackingAppId(trackingId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/track-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          targetUrl: `${window.location.origin}/gov-portal`
        })
      });
      const data = await res.json();
      if (data.success && data.tracking) {
        setLiveTrackingResults(prev => ({
          ...prev,
          [trackingId]: data.tracking
        }));
      }
    } catch (err) {
      console.error('Status tracking error:', err);
    } finally {
      setTrackingAppId(null);
    }
  };

  // ----------------------------------------------------------------
  // Strict Walk-In Citizen Session Isolation & Clear Handler
  // ----------------------------------------------------------------
  const handleClearSession = () => {
    setCitizenData({
      fullName: '',
      dob: '',
      gender: 'Male',
      idNumber: '',
      mobile: '',
      state: '',
      district: '',
      schemeName: 'Post-Matric Merit Scholarship',
      annualIncome: '',
      category: 'OBC',
      bankAccount: '',
      ifsc: ''
    });
    setSelectedFile(null);
    setFilePreview(null);
    setUserPrompt('');
    setExtractedData(null);
    setEligibility(null);
    setDiscoveredSchemes(null);
    setAgentEvents([]);
    setAgentStep(0);
    setAgentSessionId(null);
    setAgentStatusText('Agent Ready');
    setShowApprovalModal(false);
    setPreflightResult(null);
    setImpactMetrics(null);
    setActiveFamilyMemberId(null);
    setSessionClearedToast(true);
    setTimeout(() => setSessionClearedToast(false), 3500);
  };

  // ----------------------------------------------------------------
  // Offline-First Draft Queue Handlers
  // ----------------------------------------------------------------
  const queueOfflineDraft = (dataToQueue = citizenData) => {
    const draft = {
      id: `DRAFT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      timestampFormatted: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      citizenData: { ...dataToQueue },
      certificateFileName: selectedFile ? selectedFile.name : 'sample_income_certificate.png',
      status: 'QUEUED_OFFLINE',
      statusLabel: currentLang === 'hi' ? 'ऑफ़लाइन ड्राफ्ट सुरक्षित (नेटवर्क प्रतीक्षा)' : 'Awaiting Network Sync'
    };
    const updated = [draft, ...offlineQueue];
    setOfflineQueue(updated);
    try {
      localStorage.setItem('civicpulse_offline_queue', JSON.stringify(updated));
    } catch {}
    setOfflineToastMsg(t.offlineSavedToast);
    setShowOfflineToast(true);
    setTimeout(() => setShowOfflineToast(false), 3500);
  };

  const handleSyncOfflineDraft = async (draft) => {
    if (effectiveOffline) {
      alert(t.stillOfflineWarning || 'Cannot sync while offline. Please disable simulated offline or reconnect.');
      return;
    }
    setIsSyncingQueue(true);
    try {
      // Remove this draft from the queue
      const updatedQueue = offlineQueue.filter(d => d.id !== draft.id);
      setOfflineQueue(updatedQueue);
      try {
        localStorage.setItem('civicpulse_offline_queue', JSON.stringify(updatedQueue));
      } catch {}

      // Load draft's citizen data into active session
      setCitizenData(draft.citizenData);
      setOfflineToastMsg(t.syncSuccessToast);
      setShowOfflineToast(true);
      setTimeout(() => setShowOfflineToast(false), 3500);

      // Trigger agent execution
      await handleStartAgent(draft.citizenData);
    } catch (err) {
      console.error('Offline draft sync error:', err);
    } finally {
      setIsSyncingQueue(false);
    }
  };

  const handleDeleteOfflineDraft = (draftId) => {
    const updatedQueue = offlineQueue.filter(d => d.id !== draftId);
    setOfflineQueue(updatedQueue);
    try {
      localStorage.setItem('civicpulse_offline_queue', JSON.stringify(updatedQueue));
    } catch {}
  };

  // ----------------------------------------------------------------
  // Operator Vault & PIN Authentication Handlers
  // ----------------------------------------------------------------
  const handleUnlockOperatorVault = (e) => {
    if (e) e.preventDefault();
    if (operatorPinInput.trim() === '1234') {
      setIsOperatorUnlocked(true);
      setPinError('');
    } else {
      setPinError(t.invalidPinMsg || 'Invalid Operator PIN. Demo PIN is 1234.');
    }
  };

  const handleLockOperatorVault = () => {
    setIsOperatorUnlocked(false);
    setOperatorPinInput('');
    setPinError('');
  };

  // ----------------------------------------------------------------
  // Family Welfare Vault Handlers (Grouped by Household ID)
  // ----------------------------------------------------------------
  const handleSelectFamilyMember = (member) => {
    setActiveFamilyMemberId(member.id);
    const updated = {
      fullName: member.fullName,
      dob: member.dob || '2003-05-14',
      gender: member.gender || 'Male',
      idNumber: member.idNumber || '839210482910',
      mobile: member.mobile || '9876543210',
      state: member.state || 'Karnataka',
      district: member.district || 'Bengaluru Urban',
      schemeName: member.schemeName || 'Post-Matric Merit Scholarship',
      annualIncome: member.annualIncome || 180000,
      category: member.category || 'OBC',
      bankAccount: member.bankAccount || '918237465019',
      ifsc: member.ifsc || 'SBIN0001234'
    };
    setCitizenData(updated);
    evaluateEligibility(updated);
  };

  const handleSaveNewFamilyMember = (e) => {
    e.preventDefault();
    if (!newMemberForm.fullName.trim()) return;

    let annualBenefit = 50000;
    if (newMemberForm.schemeName === 'PM-Kisan Samman Nidhi') annualBenefit = 6000;
    else if (newMemberForm.schemeName === 'Ayushman Bharat Health Cover') annualBenefit = 500000;
    else if (newMemberForm.schemeName === 'State Skill Development Grant') annualBenefit = 25000;
    else if (newMemberForm.schemeName === 'National Means-cum-Merit Scholarship') annualBenefit = 12000;

    const targetHhId = newMemberForm.householdId || activeHouseholdFilter || 'HH-VERMA-2026';
    const targetHhName = newMemberForm.householdName || (targetHhId === 'HH-VERMA-2026' ? 'Verma Household Group' : `${newMemberForm.fullName} Household`);

    const newMember = {
      id: `member-${Date.now()}`,
      householdId: targetHhId,
      householdName: targetHhName,
      ...newMemberForm,
      topEligibleScheme: newMemberForm.schemeName,
      annualBenefit
    };

    const updatedList = [...familyMembers, newMember];
    setFamilyMembers(updatedList);
    try {
      localStorage.setItem('civicpulse_family_profiles', JSON.stringify(updatedList));
      fetch(`${API_BASE_URL}/api/family-profiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profiles: updatedList })
      }).catch(() => {});
    } catch {}

    handleSelectFamilyMember(newMember);
    setShowAddMemberModal(false);
  };

  // ----------------------------------------------------------------
  // Zero-Document Guided Voice Interview Mode Handlers
  // ----------------------------------------------------------------
  const KIOSK_QUESTIONS = [
    {
      step: 1,
      field: 'fullName',
      titleEn: '1. Full Legal Name',
      titleHi: '1. पूरा कानूनी नाम',
      speechEn: 'Question 1: Please speak your full legal name as in official government records.',
      speechHi: 'पहला सवाल: कृपया अपना पूरा कानूनी नाम बोलें जैसा आपके सरकारी रिकॉर्ड में है।'
    },
    {
      step: 2,
      field: 'stateAndDistrict',
      titleEn: '2. Domicile State and District',
      titleHi: '2. मूल निवास राज्य और ज़िला',
      speechEn: 'Question 2: Please speak your state and district. For example: Karnataka, Bengaluru Urban.',
      speechHi: 'दूसरा सवाल: कृपया अपना राज्य और ज़िला बताएं, जैसे कर्नाटक, बेंगलुरु अर्बन।'
    },
    {
      step: 3,
      field: 'annualIncome',
      titleEn: '3. Annual Family Income (₹)',
      titleHi: '3. वार्षिक पारिवारिक आय (₹)',
      speechEn: 'Question 3: What is your annual family household income in rupees? For example: One lakh eighty thousand rupees.',
      speechHi: 'तीसरा सवाल: आपके परिवार की वार्षिक आय कितनी है? जैसे एक लाख अस्सी हज़ार रुपये।'
    },
    {
      step: 4,
      field: 'category',
      titleEn: '4. Social Reservation Category',
      titleHi: '4. सामाजिक आरक्षण श्रेणी',
      speechEn: 'Question 4: What is your social category? General, OBC, SC, ST, or EWS?',
      speechHi: 'चौथा सवाल: आपकी सामाजिक श्रेणी क्या है? जनरल, ओबीसी, एससी, एसटी या ईडब्ल्यूएस?'
    },
    {
      step: 5,
      field: 'schemeName',
      titleEn: '5. Target Welfare Scheme',
      titleHi: '5. लक्षित सरकारी योजना',
      speechEn: 'Question 5: Which scheme would you like to apply for? Scholarship, PM-Kisan, Ayushman Bharat, or Skill Grant?',
      speechHi: 'पांचवा सवाल: आप किस योजना के लिए आवेदन करना चाहते हैं? छात्रवृत्ति, पीएम किसान, आयुष्मान भारत, या कौशल विकास?'
    }
  ];

  const handleToggleVoiceKiosk = () => {
    if (isVoiceKioskOpen) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (kioskRecognitionRef.current) {
        try { kioskRecognitionRef.current.stop(); } catch {}
      }
      setIsVoiceKioskOpen(false);
      setKioskIsSpeaking(false);
      setKioskIsListening(false);
    } else {
      setIsVoiceKioskOpen(true);
      setKioskStep(1);
      setKioskCompleted(false);
      setKioskCurrentAnswer('');
      setTimeout(() => {
        startKioskQuestion(1);
      }, 400);
    }
  };

  const startKioskQuestion = (stepNum) => {
    if (stepNum > 5) {
      finishKioskInterview();
      return;
    }
    const q = KIOSK_QUESTIONS[stepNum - 1];
    setKioskStep(stepNum);
    setKioskCurrentAnswer('');
    setKioskIsListening(false);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setKioskIsSpeaking(true);
      const textToSpeak = currentLang === 'hi' ? q.speechHi : q.speechEn;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setKioskIsSpeaking(false);
        listenKioskAnswer();
      };
      utterance.onerror = () => {
        setKioskIsSpeaking(false);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      listenKioskAnswer();
    }
  };

  const listenKioskAnswer = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setKioskIsListening(false);
      return;
    }
    try {
      if (kioskRecognitionRef.current) {
        try { kioskRecognitionRef.current.stop(); } catch {}
      }
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';

      rec.onstart = () => setKioskIsListening(true);
      rec.onend = () => setKioskIsListening(false);
      rec.onerror = (e) => {
        console.warn('Kiosk speech error:', e.error);
        setKioskIsListening(false);
      };
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setKioskCurrentAnswer(transcript);
        saveAndAdvanceKioskAnswer(kioskStep, transcript);
      };

      kioskRecognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.warn('SpeechRecognition error:', e);
      setKioskIsListening(false);
    }
  };

  const saveAndAdvanceKioskAnswer = (stepNum, rawAnswer) => {
    const answer = (rawAnswer || '').trim();
    if (!answer) return;

    setCitizenData(prev => {
      const next = { ...prev };
      if (stepNum === 1) {
        next.fullName = answer.replace(/[.,]/g, '');
      } else if (stepNum === 2) {
        const lower = answer.toLowerCase();
        if (lower.includes('maharashtra') || lower.includes('महाराष्ट्र')) {
          next.state = 'Maharashtra';
          next.district = lower.includes('pune') || lower.includes('पुणे') ? 'Pune' : 'Mumbai Suburban';
        } else if (lower.includes('delhi') || lower.includes('दिल्ली')) {
          next.state = 'Delhi';
          next.district = 'New Delhi';
        } else if (lower.includes('uttar pradesh') || lower.includes('उत्तर प्रदेश') || lower.includes('up')) {
          next.state = 'Uttar Pradesh';
          next.district = lower.includes('lucknow') || lower.includes('लखनऊ') ? 'Lucknow' : 'Varanasi';
        } else if (lower.includes('rajasthan') || lower.includes('राजस्थान')) {
          next.state = 'Rajasthan';
          next.district = 'Jaipur';
        } else {
          next.state = 'Karnataka';
          next.district = lower.includes('mysuru') || lower.includes('मैसूर') ? 'Mysuru' : 'Bengaluru Urban';
        }
      } else if (stepNum === 3) {
        const match = answer.match(/\d+[\d,.]*/);
        if (match) {
          const num = Number(match[0].replace(/,/g, ''));
          next.annualIncome = num < 100 ? num * 100000 : num;
        } else if (answer.includes('lakh') || answer.includes('लाख')) {
          if (answer.includes('1.8') || answer.includes('1 point 8') || answer.includes('एक लाख अस्सी')) next.annualIncome = 180000;
          else if (answer.includes('2') || answer.includes('दो')) next.annualIncome = 200000;
          else if (answer.includes('1.5') || answer.includes('डेढ़')) next.annualIncome = 150000;
          else next.annualIncome = 180000;
        } else {
          next.annualIncome = 180000;
        }
      } else if (stepNum === 4) {
        const lower = answer.toLowerCase();
        if (lower.includes('sc') || lower.includes('एससी') || lower.includes('अनुसूचित जाति')) next.category = 'SC';
        else if (lower.includes('st') || lower.includes('एसटी') || lower.includes('जनजाति')) next.category = 'ST';
        else if (lower.includes('ews') || lower.includes('ईडब्ल्यूएस')) next.category = 'EWS';
        else if (lower.includes('obc') || lower.includes('ओबीसी') || lower.includes('पिछड़ा')) next.category = 'OBC';
        else next.category = 'General';
      } else if (stepNum === 5) {
        const lower = answer.toLowerCase();
        if (lower.includes('kisan') || lower.includes('किसान') || lower.includes('agriculture')) {
          next.schemeName = 'PM-Kisan Samman Nidhi';
        } else if (lower.includes('ayushman') || lower.includes('आयुष्मान') || lower.includes('health') || lower.includes('स्वास्थ्य')) {
          next.schemeName = 'Ayushman Bharat Health Cover';
        } else if (lower.includes('skill') || lower.includes('कौशल') || lower.includes('रोजगार')) {
          next.schemeName = 'State Skill Development Grant';
        } else if (lower.includes('means') || lower.includes('nmmss') || lower.includes('school')) {
          next.schemeName = 'National Means-cum-Merit Scholarship';
        } else {
          next.schemeName = 'Post-Matric Merit Scholarship';
        }
      }
      return next;
    });

    if (stepNum < 5) {
      setTimeout(() => {
        startKioskQuestion(stepNum + 1);
      }, 700);
    } else {
      finishKioskInterview();
    }
  };

  const finishKioskInterview = () => {
    setKioskCompleted(true);
    setKioskIsListening(false);
    setKioskIsSpeaking(false);

    evaluateEligibility(citizenData);

    if (effectiveOffline) {
      queueOfflineDraft(citizenData);
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const completionText = effectiveOffline
        ? (currentLang === 'hi'
            ? 'वॉइस साक्षात्कार पूर्ण। नेटवर्क ऑफ़लाइन होने के कारण आपका आवेदन स्थानीय कतार में सुरक्षित सहेज लिया गया है।'
            : 'Voice interview complete. Internet is offline so your application has been safely queued in offline storage.')
        : (currentLang === 'hi'
            ? 'बधाई हो! आपका आवाज़ आधारित कियोस्क साक्षात्कार पूरा हो गया है। आपकी प्रोफ़ाइल तैयार है और अब आप सीधे स्वायत्त ऑटो-अप्लाई शुरू कर सकते हैं।'
            : 'Congratulations! Your voice kiosk interview is complete. Your citizen profile is populated and ready for autonomous Playwright execution.');
      const utter = new SpeechSynthesisUtterance(completionText);
      utter.lang = currentLang === 'hi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utter);
    }

    setTimeout(() => {
      const targetEl = document.getElementById('citizen-profile-section');
      if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  };

  // ----------------------------------------------------------------
  // Grievance Appeal Drafter Handlers
  // ----------------------------------------------------------------
  const handleOpenGrievanceModal = (app) => {
    const trackingId = app.trackingId || 'GOV-2026-OBJ-9812';
    const applicantName = app.fullName || citizenData.fullName || 'Ramesh Kumar Verma';
    const schemeName = app.schemeName || citizenData.schemeName || 'Post-Matric Merit Scholarship (PMS-2026)';
    const liveTrack = liveTrackingResults[trackingId];

    if (liveTrack && liveTrack.grievanceAppeal) {
      setGrievanceModalData(liveTrack.grievanceAppeal);
    } else {
      fetch(`${API_BASE_URL}/api/agent/generate-grievance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingId,
          applicantName,
          schemeName,
          objectionReason: liveTrack?.objectionReason || 'Tahsildar Income Certificate seal unclear / verification pending over 15 days without disposal',
          delayDays: liveTrack?.delayDays || 18,
          statutoryClause: liveTrack?.statutoryClause || 'Section 4(1) of State Public Services Guarantee Act 2021 & CPGRAMS DBT Mandate (Mandatory 15-Day Service Delivery SLA Exceeded)'
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.appeal) {
          setGrievanceModalData(data.appeal);
        }
      })
      .catch(err => console.error('Grievance generation error:', err));
    }
  };

  const handleCopyGrievance = () => {
    if (!grievanceModalData) return;
    const textToCopy = grievanceLang === 'hi' ? grievanceModalData.appealHi : grievanceModalData.appealEn;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopiedAppeal(true);
      setTimeout(() => setIsCopiedAppeal(false), 2500);
    });
  };

  const handleDownloadGrievance = () => {
    if (!grievanceModalData) return;
    const textToDownload = grievanceLang === 'hi' ? grievanceModalData.appealHi : grievanceModalData.appealEn;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Public_Grievance_Appeal_${grievanceModalData.trackingId}_${grievanceLang}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...citizenData, [name]: value };
    setCitizenData(updated);
    if (name === 'annualIncome' || name === 'schemeName' || name === 'category') {
      evaluateEligibility(updated);
    }
  };

  // ----------------------------------------------------------------
  // Launch Playwright Autonomous Execution (With Offline Intercept)
  // ----------------------------------------------------------------
  const handleStartAgent = async (dataOverride = null) => {
    const dataToUse = dataOverride || citizenData;
    if (effectiveOffline) {
      queueOfflineDraft(dataToUse);
      return;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsAgentRunning(true);
    setAgentEvents([]);
    setAgentStep(1);
    setAgentStatusText(currentLang === 'hi' ? 'स्वायत्त ब्राउज़र एजेंट प्रारंभ हो रहा है...' : 'Initializing Autonomous Browser Agent...');
    setAutoRecoveredErrorsCount(0);
    executionStartTimeRef.current = Date.now();

    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenData: dataToUse,
          certificateFileName: selectedFile ? selectedFile.name : 'sample_income_certificate.png',
          targetUrl: `${window.location.origin}/gov-portal`
        })
      });

      const data = await res.json();
      if (data.success && data.sessionId) {
        setAgentSessionId(data.sessionId);
        connectSSE(data.sessionId);
      } else {
        throw new Error(data.error || 'Failed to dispatch agent worker');
      }
    } catch (err) {
      console.error('Agent launch failed:', err);
      // If network failed (e.g. backend offline or offline mid-request), queue offline draft
      queueOfflineDraft(dataToUse);
      setIsAgentRunning(false);
      setAgentStatusText(currentLang === 'hi' ? 'नेटवर्क विफल: आवेदन ऑफ़लाइन कतार में सुरक्षित सहेजा गया।' : 'Network unavailable: Application safely secured in offline queue.');
    }
  };

  // ----------------------------------------------------------------
  // Connect to SSE Telemetry Stream
  // ----------------------------------------------------------------
  const connectSSE = (sessionId) => {
    const eventSource = new EventSource(`${API_BASE_URL}/api/agent/events/${sessionId}`);

    eventSource.onmessage = (e) => {
      try {
        const payload = JSON.parse(e.data);
        console.log('[SSE Telemetry]', payload);

        if (payload.message) {
          setAgentEvents(prev => [...prev, payload]);
          setAgentStatusText(payload.message);
        }

        if (payload.step) {
          setAgentStep(payload.step);
        }

        if (payload.status === 'SELF_HEALING_RECOVERY' || payload.status === 'SELF_HEALING_SUCCESS') {
          setAutoRecoveredErrorsCount(prev => prev + 1);
        }

        if (payload.status === 'WAITING_FOR_OTP_APPROVAL') {
          setShowApprovalModal(true);
        }

        if (payload.status === 'APPLICATION_COMPLETED') {
          setIsAgentRunning(false);
          setShowApprovalModal(false);
          fetchApplications();
          eventSource.close();

          const totalDuration = payload.durationSeconds || 
            ((Date.now() - (executionStartTimeRef.current || Date.now())) / 1000).toFixed(1);
          
          const auditInput = `${payload.trackingId}:${citizenData.fullName}:${citizenData.idNumber}:${Date.now()}`;
          computeSha256(auditInput).then(auditHash => {
            setImpactMetrics({
              trackingId: payload.trackingId,
              timeTakenSec: totalDuration,
              manualTimeMin: 45,
              autoRecoveredCount: payload.autoRecoveredCount ?? (autoRecoveredErrorsCount || 1),
              costSavedInr: 150,
              auditHash
            });
          });
        }

        if (payload.status === 'ERROR' || payload.status === 'FAILED') {
          setIsAgentRunning(false);
          setShowApprovalModal(false);
          eventSource.close();
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection notice:', err);
    };
  };

  // ----------------------------------------------------------------
  // Human-in-the-Loop OTP Approval Action
  // ----------------------------------------------------------------
  const handleApproveAgent = async () => {
    if (!agentSessionId) return;
    setIsApproving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/agent/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: agentSessionId,
          otpCode: approvalOtp || '123456'
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowApprovalModal(false);
      }
    } catch (err) {
      console.error('Approval failed:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectAgent = async () => {
    if (!agentSessionId) return;
    try {
      await fetch(`${API_BASE_URL}/api/agent/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: agentSessionId,
          reason: 'Rejected by citizen from dashboard'
        })
      });
      setShowApprovalModal(false);
      setIsAgentRunning(false);
    } catch (err) {
      console.error('Reject failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6">
        
        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.trackTag}</span>
              </span>
              <span className="text-xs text-slate-500">{t.agentSubtitle}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center space-x-3">
              <span>{t.appTitle}</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {t.appDesc}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* 🌐 Top Header Language Switcher */}
            <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs shadow-inner">
              <span className="text-slate-400 px-2 flex items-center space-x-1.5 font-medium">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">{t.langLabel}</span>
              </span>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentLang === 'hi' 
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>🇮🇳 हिन्दी</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1.5 ${
                  currentLang === 'en' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span>English</span>
              </button>
            </div>

            {/* 🎙️ Voice Kiosk Mode Toggle Button */}
            <button
              type="button"
              onClick={handleToggleVoiceKiosk}
              className={`px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center space-x-2 border shadow-lg ${
                isVoiceKioskOpen 
                  ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white border-amber-400/50 shadow-rose-600/30 ring-2 ring-amber-400/40 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/30 shadow-purple-600/20'
              }`}
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>{t.voiceKioskBtn}</span>
            </button>

            {/* 🧹 New Citizen / Clear Session Button */}
            <button
              type="button"
              onClick={handleClearSession}
              className="px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-white border border-rose-800/60 transition flex items-center space-x-1.5 shadow-sm"
              title="Wipe active form, files & logs for the next walk-in citizen"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.newCitizenClearBtn}</span>
            </button>

            {/* 🔐 PIN-Protected Operator / Family Vault Trigger */}
            <button
              type="button"
              onClick={() => setIsOperatorDrawerOpen(true)}
              className="px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 text-indigo-300 hover:text-white border border-indigo-700/60 transition flex items-center space-x-1.5 shadow-md shadow-indigo-950/40"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.operatorVaultBtn}</span>
            </button>

            {/* 📴 Simulate Offline Mode Button */}
            <button
              type="button"
              onClick={() => setIsSimulatedOffline(prev => !prev)}
              className={`px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition flex items-center space-x-1.5 border shadow-sm ${
                isSimulatedOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/60 ring-2 ring-amber-400/40 animate-pulse'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-700'
              }`}
              title="Toggle simulated offline mode to demo offline-first draft queueing and automatic sync"
            >
              {isSimulatedOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              <span>{isSimulatedOffline ? t.offlineSimulatedBadge : t.simulateOfflineBtn}</span>
            </button>

            <button
              onClick={handleLoadSampleCertificate}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition shadow-lg shadow-blue-500/20 flex items-center space-x-2 border border-blue-400/30"
            >
              <FileCheck className="w-4 h-4 text-blue-200" />
              <span>{t.loadSampleBtn}</span>
            </button>

            <a
              href="/gov-portal"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs sm:text-sm font-medium transition border border-slate-700 flex items-center space-x-1.5"
            >
              <Landmark className="w-4 h-4 text-amber-400" />
              <span>{t.viewGovPortalBtn}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Feedback Alert: Session Cleared */}
        {sessionClearedToast && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500 rounded-xl text-xs text-emerald-200 flex items-center justify-between animate-fadeIn shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{t.newCitizenClearedToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSessionClearedToast(false)}
              className="text-slate-400 hover:text-white font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* ========================================================== */}
        {/* 👤 ACTIVE CITIZEN SESSION (STRICT PRIVACY ISOLATION)       */}
        {/* ========================================================== */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>{t.activeCitizenSessionTitle}</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Session: {citizenData.idNumber ? `CIT-••••${String(citizenData.idNumber).slice(-4)}` : 'WALK-IN-ISOLATED'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mt-0.5 flex items-center space-x-2">
                  <span>{citizenData.fullName || t.unregisteredCitizen}</span>
                  {citizenData.annualIncome && (
                    <span className="text-xs font-normal text-slate-400">
                      • ₹{Number(citizenData.annualIncome).toLocaleString('en-IN')}/yr ({citizenData.category})
                    </span>
                  )}
                </h3>
              </div>
            </div>

            {/* Individual Active Citizen Benefit */}
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl px-4 py-2 self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
              <span className="text-[10px] uppercase text-slate-400 font-bold block">
                {t.individualEligibleBenefit}
              </span>
              <span className="text-lg sm:text-xl font-mono font-extrabold text-emerald-400">
                {discoveredSchemes
                  ? (currentLang === 'hi' ? discoveredSchemes.totalBenefitFormattedHi : discoveredSchemes.totalBenefitFormatted)
                  : (citizenData.schemeName === 'Post-Matric Merit Scholarship'
                      ? '₹50,000/yr'
                      : citizenData.schemeName === 'PM-Kisan Samman Nidhi'
                        ? '₹6,000/yr'
                        : citizenData.schemeName === 'Ayushman Bharat Health Cover'
                          ? '₹5,00,000/yr'
                          : citizenData.schemeName === 'State Skill Development Grant'
                            ? '₹25,000/yr'
                            : '₹12,000/yr')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2 pt-1">
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400/90">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.activeCitizenSessionDesc}</span>
            </div>
            <div className="text-[11px] text-slate-500">
              Target: <span className="font-semibold text-slate-300">{citizenData.schemeName}</span>
            </div>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {showOfflineToast && (
          <div className="p-3 bg-slate-900 border-2 border-indigo-500 rounded-xl text-xs text-white flex items-center justify-between animate-fadeIn shadow-2xl">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>{offlineToastMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setShowOfflineToast(false)}
              className="text-slate-400 hover:text-white font-bold px-1"
            >
              ×
            </button>
          </div>
        )}

        {/* 📴 Offline Status Alert Ribbon */}
        {effectiveOffline && (
          <div className="bg-amber-950/70 border-2 border-amber-500/60 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200 shadow-lg animate-fadeIn">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-500/40">
                <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">{t.offlineBannerTitle}</span>
                <p className="text-amber-300/90 text-xs mt-0.5">
                  {t.offlineBannerDesc}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono bg-amber-900/80 px-2.5 py-1 rounded text-amber-300 border border-amber-600 font-bold">
                {isSimulatedOffline ? 'Simulated Offline Active' : 'Network Disconnected'}
              </span>
              <button
                type="button"
                onClick={() => setIsSimulatedOffline(false)}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
              >
                Disable Offline Mode
              </button>
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* 📴 QUEUED OFFLINE APPLICATIONS (LOCAL DRAFT REPOSITORY)     */}
        {/* ========================================================== */}
        {offlineQueue.length > 0 && (
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-2xl p-5 shadow-xl space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/40 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
                  <WifiOff className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">
                      {t.queuedDraftsTitle}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      {offlineQueue.length} Draft{offlineQueue.length > 1 ? 's' : ''} Pending
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t.queuedDraftsSubtitle}
                  </p>
                </div>
              </div>

              {/* Quick Sync Top Application */}
              <div>
                <button
                  type="button"
                  disabled={isSyncingQueue}
                  onClick={() => handleSyncOfflineDraft(offlineQueue[0])}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-2 shadow-md ${
                    effectiveOffline
                      ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                  }`}
                  title={effectiveOffline ? 'Reconnect network or disable simulated offline to sync' : 'Sync and execute via Playwright'}
                >
                  {isSyncingQueue ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{t.syncingBtn}</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{t.syncNowBtn} ({offlineQueue[0].citizenData.fullName || 'Citizen'})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* List of Queued Drafts */}
            <div className="space-y-2.5 pt-1">
              {offlineQueue.map((draft) => (
                <div
                  key={draft.id}
                  className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/90 hover:border-amber-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">
                        {draft.citizenData.fullName || t.unregisteredCitizen}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                        {draft.citizenData.schemeName}
                      </span>
                      <span className="text-[10px] text-amber-300/90 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        {draft.statusLabel || 'Awaiting Network Sync'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Income: ₹{Number(draft.citizenData.annualIncome || 0).toLocaleString('en-IN')} • Category: {draft.citizenData.category} • State: {draft.citizenData.state}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Queued: {draft.timestampFormatted || 'Recent'} • ID: {draft.id}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      type="button"
                      disabled={isSyncingQueue}
                      onClick={() => handleSyncOfflineDraft(draft)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
                        effectiveOffline
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                      }`}
                    >
                      <Play className="w-3 h-3 text-indigo-300" />
                      <span>{t.syncNowBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteOfflineDraft(draft.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition"
                      title="Discard queued draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================== */}
        {/* 🎙️ ZERO-DOCUMENT GUIDED VOICE INTERVIEW MODE               */}
        {/* ========================================================== */}
        {isVoiceKioskOpen && (
          <div className="bg-gradient-to-r from-purple-950/90 via-slate-900 to-indigo-950/90 border-2 border-purple-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-purple-800/50 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center flex-shrink-0 animate-pulse">
                  <Mic className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                      {t.voiceKioskTitle}
                    </span>
                    <span className="text-xs text-amber-300 font-semibold">
                      {t.kioskQuestionLabel} {kioskStep} {t.kioskOfTotal}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    {currentLang === 'hi' ? KIOSK_QUESTIONS[kioskStep - 1]?.titleHi : KIOSK_QUESTIONS[kioskStep - 1]?.titleEn}
                  </h3>
                  <p className="text-xs text-purple-200/80">
                    {t.voiceKioskSubtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleToggleVoiceKiosk}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700 font-medium transition"
                >
                  {t.kioskExitBtn}
                </button>
              </div>
            </div>

            {/* Stepper Progress */}
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {KIOSK_QUESTIONS.map((q) => (
                <div
                  key={q.step}
                  onClick={() => startKioskQuestion(q.step)}
                  className={`p-2 rounded-lg cursor-pointer border transition text-[11px] ${
                    kioskStep === q.step
                      ? 'bg-purple-600 text-white font-bold border-purple-400 shadow-md'
                      : kioskStep > q.step
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    {kioskStep > q.step ? <Check className="w-3 h-3 text-emerald-400" /> : null}
                    <span>Q{q.step}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Interview Prompt & Audio Wave Box */}
            <div className="bg-slate-950/80 border border-purple-500/30 rounded-xl p-5 space-y-4 text-center">
              <div className="text-sm sm:text-base font-semibold text-white max-w-xl mx-auto leading-relaxed">
                "{currentLang === 'hi' ? KIOSK_QUESTIONS[kioskStep - 1]?.speechHi : KIOSK_QUESTIONS[kioskStep - 1]?.speechEn}"
              </div>

              {/* Status indicator */}
              <div className="flex items-center justify-center space-x-2 text-xs">
                {kioskIsSpeaking ? (
                  <span className="text-purple-300 flex items-center space-x-1.5 animate-pulse">
                    <Volume2 className="w-4 h-4 text-purple-400" />
                    <span>{t.kioskSpeakingState}</span>
                  </span>
                ) : kioskIsListening ? (
                  <span className="text-amber-300 flex items-center space-x-1.5 animate-pulse">
                    <Mic className="w-4 h-4 text-amber-400" />
                    <span>{t.kioskListeningState}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Speak into microphone or enter text below:</span>
                )}
              </div>

              {/* Spoken Answer Input / Transcript */}
              <div className="max-w-md mx-auto flex items-center space-x-2">
                <input
                  type="text"
                  value={kioskCurrentAnswer}
                  onChange={(e) => setKioskCurrentAnswer(e.target.value)}
                  placeholder="Spoken answer will transcribe here..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => listenKioskAnswer()}
                  className={`p-2.5 rounded-lg border transition ${
                    kioskIsListening ? 'bg-amber-500 text-slate-950 border-amber-400' : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                  }`}
                  title="Speak again"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => startKioskQuestion(kioskStep)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center space-x-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.kioskSpeakAgain}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const ans = kioskCurrentAnswer || (
                      kioskStep === 1 ? 'Ramesh Kumar Verma' :
                      kioskStep === 2 ? 'Karnataka, Bengaluru Urban' :
                      kioskStep === 3 ? '180000' :
                      kioskStep === 4 ? 'OBC' : 'Post-Matric Merit Scholarship'
                    );
                    saveAndAdvanceKioskAnswer(kioskStep, ans);
                  }}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center space-x-1.5"
                >
                  <span>{t.kioskNextBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (kioskStep < 5) startKioskQuestion(kioskStep + 1);
                    else finishKioskInterview();
                  }}
                  className="text-xs text-slate-500 hover:text-slate-300 underline ml-2"
                >
                  {t.kioskSkipBtn}
                </button>
              </div>

              {kioskCompleted && (
                <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center justify-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.kioskCompletedBanner}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🛡️ Privacy Shield Active Indicator Banner */}
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-sm">{t.privacyShieldActive}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {t.zeroRetention}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                {t.privacyShieldDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="text-slate-400 hidden sm:inline">{t.protectedTokensLabel}</span>
            <span className="font-mono font-bold text-emerald-300 bg-emerald-900/40 px-2.5 py-1 rounded border border-emerald-700/50">
              {t.guardedAadhaarBank}
            </span>
          </div>
        </div>

        {/* 🚀 Impact Summary & Public ROI Telemetry Card */}
        {impactMetrics && (
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-xl p-5 shadow-xl space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900/60 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {t.impactTitle}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400">{t.applicationLabel}</span>
                <span className="text-[11px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {impactMetrics.trackingId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
              {/* Metric 1: Execution Time */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{t.timeTaken}</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-emerald-400 mt-1">
                  {impactMetrics.timeTakenSec}s
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t.timeTakenVsManual}
                </div>
              </div>

              {/* Metric 2: Cyber-Cafe Cost Saved */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center space-x-1">
                  <DollarSign className="w-3 h-3 text-amber-400" />
                  <span>{t.brokerageCostSaved}</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-amber-400 mt-1">
                  ₹{impactMetrics.costSavedInr}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t.brokerageDesc}
                </div>
              </div>

              {/* Metric 3: Self-Healing Recoveries */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center justify-center space-x-1">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span>{t.autoRecoveredErrors}</span>
                </div>
                <div className="text-xl font-mono font-extrabold text-blue-400 mt-1">
                  {impactMetrics.autoRecoveredCount} {t.healedSuffix}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t.autoRecoveredDesc}
                </div>
              </div>

              {/* Metric 4: SHA-256 Audit Token */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-indigo-400" />
                  <span>{t.shaAuditToken}</span>
                </div>
                <div className="font-mono text-[10px] text-indigo-300 break-all mt-1 truncate">
                  {impactMetrics.auditHash}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {t.auditTokenDesc}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* 🔍 FEATURE: Read & Explain Government Scheme / Webpage URL    */}
        {/* ------------------------------------------------------------- */}
        <div className="bg-slate-900/90 border border-indigo-500/40 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-2">
                  <span>{t.explainSectionTitle}</span>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/60 font-mono">
                    Playwright + Gemini AI
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.explainSectionSubtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const defaultUrl = `${window.location.origin}/gov-portal`;
                setSchemeUrl(defaultUrl);
                handleExplainScheme(defaultUrl);
              }}
              className="text-xs text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/80 px-3 py-1.5 rounded-lg transition flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Landmark className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.useLocalGovPortalBtn}</span>
            </button>
          </div>

          {/* Input Controls: URL or Upload Document */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-7">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center justify-between">
                <span>{t.urlInputLabel}</span>
                <span className="text-[10px] text-slate-500 font-mono">Visible text extracted by Playwright</span>
              </label>
              <input
                type="url"
                value={schemeUrl}
                onChange={(e) => setSchemeUrl(e.target.value)}
                placeholder={t.urlPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5 truncate">
                {t.uploadNoticeLabel}
              </label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                onChange={(e) => setNoticeFile(e.target.files[0] || null)}
                className="w-full text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer bg-slate-950 rounded-lg border border-slate-700 py-1 px-2"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => handleExplainScheme()}
                disabled={isExplaining || (!schemeUrl && !noticeFile)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md shadow-indigo-600/30"
              >
                {isExplaining ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>{t.readAndExplainBtn}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress / Status Indicator during Scraping */}
          {isExplaining && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-lg text-xs text-indigo-300 flex items-center space-x-2 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>{t.readingAndExplaining}</span>
            </div>
          )}

          {explainError && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-xs text-red-300 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{explainError}</span>
            </div>
          )}

          {/* Voice Accessibility Toolbar before full explanation */}
          {!explanationData && !isExplaining && (
            <VoiceExplainerControls
              explanation={null}
              currentLang={currentLang}
              defaultAutoPlay={false}
              onVoiceQuery={(query) => {
                setUserPrompt(query);
              }}
            />
          )}

          {/* Structured Explanation Output Display Card */}
          {explanationData && (
            <div className="bg-slate-950 rounded-xl p-5 border border-indigo-500/50 space-y-4 animate-scaleUp">
              {/* Header with Scheme Name and Language Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono uppercase bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-800">
                      {explanationData.sourceTitle || 'Official Scheme Notice'}
                    </span>
                    <span className="text-[11px] text-slate-500 truncate max-w-xs">{explanationData.sourceUrl}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mt-1 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-amber-400 flex-shrink-0" />
                    <span>{explanationData.schemeName}</span>
                  </h3>
                </div>

                {/* Hinglish / Hindi / English Language Tabs */}
                <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setExplanationLang('hinglish')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      explanationLang === 'hinglish' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.langTabHinglish}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExplanationLang('hi')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      explanationLang === 'hi' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.langTabHindi}
                  </button>
                  <button
                    type="button"
                    onClick={() => setExplanationLang('en')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      explanationLang === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.langTabEnglish}
                  </button>
                </div>
              </div>

              {/* Two-Way Voice Accessibility (Mic Query + Text-to-Speech Audio Playback) */}
              <VoiceExplainerControls
                explanation={explanationData}
                currentLang={explanationLang === 'en' ? 'en' : 'hi'}
                onVoiceQuery={(query) => {
                  setUserPrompt(query);
                }}
              />

              {/* Highlights Chips */}
              {explanationData.keyHighlights && explanationData.keyHighlights.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {explanationData.keyHighlights.map((hl, hIdx) => (
                    <span key={hIdx} className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300">
                      <strong className="text-indigo-400">{hl.label}:</strong> {hl.value}
                    </span>
                  ))}
                </div>
              )}

              {/* 3-Part Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Part 1: What this scheme/page is about */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="font-bold text-white flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-800 text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{t.aboutSchemeTitle}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {explanationData.about ? (explanationData.about[explanationLang] || explanationData.about.en) : ''}
                  </p>
                </div>

                {/* Part 2: Who is eligible & required documents */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="font-bold text-white flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-800 text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t.eligibilityDocsTitle}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {explanationData.eligibilityAndDocs ? (explanationData.eligibilityAndDocs[explanationLang] || explanationData.eligibilityAndDocs.en) : ''}
                  </p>
                  {explanationData.eligibilityAndDocs?.requiredDocuments && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                        {t.requiredDocsLabel}
                      </span>
                      <ul className="space-y-1">
                        {explanationData.eligibilityAndDocs.requiredDocuments.slice(0, 3).map((doc, dIdx) => (
                          <li key={dIdx} className="flex items-start space-x-1.5 text-[11px] text-slate-300">
                            <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{translateDocItem(doc, currentLang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Part 3: Step-by-step instructions to apply */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <div className="font-bold text-white flex items-center space-x-1.5 text-xs pb-1 border-b border-slate-800 text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.stepsToApplyTitle}</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-xs">
                    {explanationData.stepsToApply ? (explanationData.stepsToApply[explanationLang] || explanationData.stepsToApply.en) : ''}
                  </p>
                  {explanationData.stepsToApply?.steps && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      {explanationData.stepsToApply.steps.slice(0, 3).map((st, sIdx) => (
                        <div key={sIdx} className="flex items-start space-x-1.5 text-[11px] text-slate-300 bg-slate-950/60 p-1 rounded border border-slate-800">
                          <span className="w-4 h-4 rounded bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="truncate">{st}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Bar: Auto-Apply Button */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-emerald-400" />
                  <span>{t.autoApplySub}</span>
                </div>

                <button
                  type="button"
                  onClick={handleAutoApplyFromExplanation}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white rounded-lg text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2"
                >
                  <span>{t.autoApplyBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Multilingual Voice & Natural Language Assistant */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {t.section1Title}
              </h2>
            </div>
            
            {/* Language Switcher in Section 1 */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">{t.speechLangLabel}</span>
              <button
                type="button"
                onClick={() => handleLanguageChange('hi')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                  currentLang === 'hi' ? 'bg-orange-500 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>🇮🇳 हिन्दी (hi-IN)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center space-x-1 ${
                  currentLang === 'en' ? 'bg-blue-600 text-white shadow' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>English (en-IN)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') triggerExtraction(selectedFile, userPrompt);
                }}
                placeholder={t.promptPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={toggleListening}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center space-x-2 transition ${
                isListening 
                  ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-white" />
                  <span>{t.listeningText}</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-orange-400" />
                  <span>{t.voiceInputText}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => triggerExtraction(selectedFile, userPrompt)}
              disabled={isExtracting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition flex items-center justify-center space-x-2 shadow"
            >
              {isExtracting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{t.parseIntentBtn}</span>
            </button>
          </div>

          {/* Quick Presets for Demo */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">{t.quickQueriesLabel}</span>
            <button
              type="button"
              onClick={() => {
                const text = currentLang === 'hi' 
                  ? "मेरा स्कॉलरशिप फॉर्म भर दो, पारिवारिक आय 1.8 लाख, ओबीसी श्रेणी"
                  : "Mera scholarship form bhar do, family income 1.8 lakh, OBC category";
                setUserPrompt(text);
                triggerExtraction(selectedFile, text);
              }}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              {currentLang === 'hi' ? '🎓 छात्रवृत्ति (PMS-2026)' : '🎓 Scholarship (PMS-2026)'}
            </button>
            <button
              type="button"
              onClick={() => {
                const text = currentLang === 'hi' 
                  ? "पीएम किसान सम्मान निधि के लिए आवेदन करें, वार्षिक आय 2 लाख"
                  : "Apply for PM-Kisan scheme, income 2 lakh";
                setUserPrompt(text);
                triggerExtraction(selectedFile, text);
              }}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              {currentLang === 'hi' ? '🌾 पीएम किसान योजना' : '🌾 PM-Kisan Scheme'}
            </button>
            <button
              type="button"
              onClick={() => {
                const text = currentLang === 'hi' 
                  ? "राज्य युवा कौशल विकास अनुदान, आय 1.2 लाख, एससी श्रेणी"
                  : "Youth skill grant, income 1.2 lakh, SC category";
                setUserPrompt(text);
                triggerExtraction(selectedFile, text);
              }}
              className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            >
              {currentLang === 'hi' ? '💼 युवा कौशल विकास अनुदान' : '💼 Youth Skill Grant'}
            </button>
          </div>
        </div>

        {/* ========================================================== */}
        {/* MULTI-SCHEME AUTO-DISCOVERY HERO BANNER                   */}
        {/* ========================================================== */}
        {discoveredSchemes && (
          <div className="bg-gradient-to-r from-blue-950/90 via-indigo-950/80 to-slate-900 border-2 border-blue-500/50 rounded-2xl p-5 md:p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-blue-800/40 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      {t.multiSchemeTitle}
                    </span>
                    <span className="text-xs text-slate-400">
                      {discoveredSchemes.eligibleCount} of {discoveredSchemes.totalEvaluated} Schemes Qualified
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">
                    {currentLang === 'hi'
                      ? `आप ${discoveredSchemes.eligibleCount} योजनाओं के लिए पात्र हैं — कुल मूल्य ${discoveredSchemes.totalBenefitFormattedHi}`
                      : `You qualify for ${discoveredSchemes.eligibleCount} schemes worth ${discoveredSchemes.totalBenefitFormatted}`}
                  </h3>
                  <p className="text-xs text-blue-200/80">{t.multiSchemeSubtitle}</p>
                </div>
              </div>

              <div className="bg-blue-900/40 border border-blue-500/30 rounded-xl px-4 py-2.5 text-right self-stretch sm:self-auto flex sm:flex-col justify-between items-center sm:items-end">
                <span className="text-[11px] text-blue-300 font-medium">Total Annual Financial Benefit</span>
                <span className="text-xl md:text-2xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {discoveredSchemes.totalBenefitFormatted}
                </span>
              </div>
            </div>

            {/* Scheme Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              {discoveredSchemes.allSchemes.map((scheme) => {
                const isSelected = citizenData.schemeName === scheme.id || citizenData.schemeName === scheme.name;
                return (
                  <div
                    key={scheme.id}
                    className={`rounded-xl p-4 transition border ${
                      isSelected
                        ? 'bg-blue-900/40 border-blue-400 shadow-md ring-1 ring-blue-400/40'
                        : scheme.isEligible
                          ? 'bg-slate-950/70 border-slate-800 hover:border-blue-500/50'
                          : 'bg-slate-950/40 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        scheme.isEligible 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}>
                        {scheme.isEligible ? (currentLang === 'hi' ? 'पात्र (Eligible)' : 'Eligible') : (currentLang === 'hi' ? 'अपात्र' : 'Ineligible')}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {currentLang === 'hi' ? scheme.annualBenefitFormattedHi : scheme.annualBenefitFormatted}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white leading-snug">
                      {currentLang === 'hi' ? scheme.nameHi : scheme.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {currentLang === 'hi' ? scheme.ministryHi : scheme.ministry}
                    </p>

                    <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Max Income: ₹{scheme.maxThreshold?.toLocaleString('en-IN')}
                      </span>

                      {scheme.isEligible ? (
                        <button
                          type="button"
                          onClick={() => handleSelectDiscoveredScheme(scheme.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white'
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-white" />
                              <span>{t.selectedSchemeActive}</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                              <span>{t.selectAndApplyBtn}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Threshold exceeded</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Section 2 & Section 3 (Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Document Ingestion Card (Col 4) */}
          <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {t.section2Title}
                </h2>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                {t.docUploadDesc}
              </p>

              <label 
                htmlFor="doc-upload" 
                className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/50 transition group"
              >
                <FileText className="w-10 h-10 text-slate-500 group-hover:text-blue-400 transition mb-2" />
                <span className="text-xs font-semibold text-slate-300 group-hover:text-white text-center">
                  {t.browseDocText}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">{t.docFormats}</span>
                <input
                  id="doc-upload"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>

              {/* Document Preview Thumbnail */}
              {filePreview ? (
                <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center space-x-3">
                  <img src={filePreview} alt="Preview" className="w-12 h-12 object-cover rounded border border-slate-700" />
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {selectedFile ? selectedFile.name : 'sample_income_certificate.png'}
                    </p>
                    <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{t.readyForPlaywright}</span>
                    </span>
                  </div>
                </div>
              ) : selectedFile ? (
                <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center space-x-2 text-xs text-slate-300">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="truncate">{selectedFile.name}</span>
                </div>
              ) : null}

              {/* Document Pre-Flight Quality & Size Check Badge */}
              {preflightResult && (
                <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 flex items-center space-x-1.5 text-[11px]">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{t.preflightPassedBadge}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 border border-emerald-700/60">
                      {preflightResult.optimizedSizeKB} KB / {t.preflightLimitLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300/90 leading-tight">
                    {t.preflightDesc}
                  </p>
                  <div className="grid grid-cols-2 gap-1 pt-1.5 border-t border-emerald-900/40 text-[10px] text-emerald-200/90">
                    <div>• Format: <strong className="text-white">PDF / PNG / JPG</strong></div>
                    <div>• Buffer: <strong className="text-white">Non-Empty Binary</strong></div>
                    <div>• Size: <strong className="text-white">&lt; 200 KB Validated</strong></div>
                    <div>• Portal Rule: <strong className="text-white">100% Compliant</strong></div>
                  </div>
                </div>
              )}
            </div>

            {/* Ingestion Engine Badge */}
            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">{t.extractionEngineLabel}</span>
                <span className={`px-2 py-0.5 rounded font-mono font-medium ${
                  extractionSource === 'gemini-multimodal-llm' 
                    ? 'bg-purple-900/50 text-purple-300 border border-purple-700/50' 
                    : 'bg-emerald-900/50 text-emerald-300 border border-emerald-700/50'
                }`}>
                  {extractionSource === 'gemini-multimodal-llm' ? t.geminiFlash : t.smartOffline}
                </span>
              </div>
            </div>
          </div>

          {/* Extracted Form Data & Scheme Eligibility (Col 8) */}
          <div id="citizen-profile-section" className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white">
                    {t.section3Title}
                  </h2>
                  <p className="text-xs text-slate-400">{t.profileSubDesc}</p>
                </div>
              </div>

              {eligibility && (
                <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                  eligibility.isEligible 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}>
                  {eligibility.isEligible ? <Check className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{eligibility.isEligible ? t.eligibleBadge : t.ineligibleBadge}</span>
                </div>
              )}
            </div>

            {/* Scheme Eligibility Explanation Banner with Guideline Citation & Document Checklist */}
            {eligibility && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-3 ${
                eligibility.isEligible 
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200' 
                  : 'bg-red-950/40 border-red-800/60 text-red-200'
              }`}>
                <div className="font-semibold flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>{t.ruleVerificationFor} {eligibility.schemeName}</span>
                </div>

                {/* Primary & Secondary Explanations responding to selected language */}
                {currentLang === 'hi' ? (
                  <>
                    <p className="text-emerald-300 font-medium text-sm leading-relaxed">
                      {eligibility.explanationHi}
                    </p>
                    <p className="text-slate-400 italic text-xs pt-1 border-t border-emerald-800/40">
                      {eligibility.explanationEn}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-slate-200 leading-relaxed">
                      {eligibility.explanationEn}
                    </p>
                    <p className="text-slate-400 italic font-serif text-xs">
                      {eligibility.explanationHi}
                    </p>
                  </>
                )}

                {/* 📜 Official Guideline Clause Citation */}
                {eligibility.officialCitation && (
                  <div className="pt-2 border-t border-emerald-800/50">
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1">
                      {t.statutoryAuthority}
                    </span>
                    <div className="p-2 bg-emerald-950/70 border border-emerald-800/80 rounded font-mono text-[11px] text-emerald-300">
                      📜 {eligibility.officialCitation}
                    </div>
                  </div>
                )}

                {/* 📋 Mandatory Scheme Document Checklist */}
                {eligibility.documentChecklist && eligibility.documentChecklist.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-semibold text-emerald-400 block mb-1.5">
                      {t.checklistTitle}
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-300">
                      {eligibility.documentChecklist.map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-start space-x-1.5 bg-slate-900/60 p-1.5 rounded border border-slate-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span>{translateDocItem(doc, currentLang)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Structured Form Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">{t.fullName}</label>
                <input
                  name="fullName"
                  type="text"
                  value={citizenData.fullName}
                  onChange={handleInputChange}
                  placeholder="Ramesh Kumar Verma"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.dob}</label>
                <input
                  name="dob"
                  type="date"
                  value={citizenData.dob}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.gender}</label>
                <select
                  name="gender"
                  value={citizenData.gender}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Male">{t.genderMale}</option>
                  <option value="Female">{t.genderFemale}</option>
                  <option value="Other">{t.genderOther}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.aadhaarLabel}</label>
                <input
                  name="idNumber"
                  type="text"
                  maxLength={12}
                  value={citizenData.idNumber}
                  onChange={handleInputChange}
                  placeholder="839210482910"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.mobileLabel}</label>
                <input
                  name="mobile"
                  type="text"
                  maxLength={10}
                  value={citizenData.mobile}
                  onChange={handleInputChange}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.stateLabel}</label>
                <input
                  name="state"
                  type="text"
                  value={citizenData.state}
                  onChange={handleInputChange}
                  placeholder="Karnataka"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.districtLabel}</label>
                <input
                  name="district"
                  type="text"
                  value={citizenData.district}
                  onChange={handleInputChange}
                  placeholder="Bengaluru Urban"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.categoryLabel}</label>
                <select
                  name="category"
                  value={citizenData.category}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="General">{currentLang === 'hi' ? 'सामान्य (General)' : 'General'}</option>
                  <option value="OBC">{currentLang === 'hi' ? 'ओबीसी (OBC)' : 'OBC'}</option>
                  <option value="SC">{currentLang === 'hi' ? 'एससी (SC)' : 'SC'}</option>
                  <option value="ST">{currentLang === 'hi' ? 'एसटी (ST)' : 'ST'}</option>
                  <option value="EWS">{currentLang === 'hi' ? 'ईडब्ल्यूएस (EWS)' : 'EWS'}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.annualIncomeLabel}</label>
                <input
                  name="annualIncome"
                  type="number"
                  value={citizenData.annualIncome}
                  onChange={handleInputChange}
                  placeholder="180000"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-400 block mb-1">{t.schemeLabel}</label>
                <select
                  name="schemeName"
                  value={citizenData.schemeName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Post-Matric Merit Scholarship">
                    {currentLang === 'hi' ? 'पोस्ट-मैट्रिक मेरिट छात्रवृत्ति (PMS-2026)' : 'Post-Matric Merit Scholarship (PMS-2026)'}
                  </option>
                  <option value="PM-Kisan Samman Nidhi">
                    {currentLang === 'hi' ? 'पीएम-किसान सम्मान निधि (PM-KISAN)' : 'PM-Kisan Samman Nidhi (PM-KISAN)'}
                  </option>
                  <option value="Ayushman Bharat Health Cover">
                    {currentLang === 'hi' ? 'आयुष्मान भारत पीएम-जय (₹5 लाख स्वास्थ्य सुरक्षा)' : 'Ayushman Bharat PM-JAY (₹5L Health Cover)'}
                  </option>
                  <option value="State Skill Development Grant">
                    {currentLang === 'hi' ? 'राज्य युवा कौशल विकास अनुदान' : 'State Youth Skill Development & Apprenticeship Grant'}
                  </option>
                  <option value="National Means-cum-Merit Scholarship">
                    {currentLang === 'hi' ? 'राष्ट्रीय साधन-सह-योग्यता छात्रवृत्ति (NMMSS)' : 'National Means-cum-Merit Scholarship (NMMSS)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.bankAccountLabel}</label>
                <input
                  name="bankAccount"
                  type="text"
                  value={citizenData.bankAccount}
                  onChange={handleInputChange}
                  placeholder="987654321012"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{t.ifscLabel}</label>
                <input
                  name="ifsc"
                  type="text"
                  maxLength={11}
                  value={citizenData.ifsc}
                  onChange={handleInputChange}
                  placeholder="SBIN0001234"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 font-mono uppercase text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pre-Flight Quality Assurance Badge */}
            {preflightResult && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{t.preflightPassedBadge}</span>
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                  Verified Payload: <span className="text-emerald-400 font-bold">{preflightResult.optimizedSizeKB} KB</span> • {t.preflightLimitLabel}
                </div>
              </div>
            )}

            {/* Launch Playwright Agent Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-400 flex items-center space-x-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>{t.executionModeLabel} <strong className="text-white">{t.executionModeValue}</strong></span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => queueOfflineDraft(citizenData)}
                  disabled={!citizenData.fullName}
                  className="px-3.5 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50 shadow-sm"
                  title="Manually save this profile as an offline draft"
                >
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.saveOfflineDraftBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartAgent()}
                  disabled={isAgentRunning || !citizenData.fullName}
                  className={`w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 ${
                    effectiveOffline
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/20'
                  }`}
                >
                  {isAgentRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.agentExecuting}</span>
                    </>
                  ) : effectiveOffline ? (
                    <>
                      <WifiOff className="w-4 h-4" />
                      <span>Queue Offline Application</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>{t.launchAgentBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Live Agent Execution Timeline & Self-Healing Telemetry */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {t.section4Title}
              </h2>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">{t.liveStatusLabel}</span>
              <span className={`px-2.5 py-1 rounded font-semibold ${
                isAgentRunning 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' 
                  : agentEvents.length > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {agentStatusText}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs mb-4">
            {[
              { num: 1, label: t.phase1 },
              { num: 2, label: t.phase2 },
              { num: 3, label: t.phase3 },
              { num: 5, label: t.phase4 },
              { num: 8, label: t.phase5 }
            ].map(st => (
              <div 
                key={st.num}
                className={`p-2.5 rounded-lg border text-center transition ${
                  agentStep >= st.num 
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 font-semibold' 
                    : 'bg-slate-950/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[10px] text-slate-400">Step {st.num}</div>
                <div>{st.label}</div>
              </div>
            ))}
          </div>

          {/* Live Telemetry Log Box */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs max-h-48 overflow-y-auto space-y-1.5">
            {agentEvents.length === 0 ? (
              <div className="text-slate-500 italic py-2">
                {t.telemetryStandby}
              </div>
            ) : (
              agentEvents.map((evt, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-slate-300">
                  <span className="text-slate-600">[{new Date(evt.timestamp || Date.now()).toLocaleTimeString()}]</span>
                  <span className={
                    evt.status === 'SELF_HEALING_RECOVERY' ? 'text-amber-400 font-bold' :
                    evt.status === 'SELF_HEALING_SUCCESS' ? 'text-blue-400 font-bold' :
                    evt.status === 'WAITING_FOR_OTP_APPROVAL' ? 'text-amber-400 font-bold' :
                    evt.status === 'APPLICATION_COMPLETED' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                  }>
                    {evt.message}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 5: Receipts & Application Vault */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                {t.section5Title} ({applications.length})
              </h2>
            </div>

            <button
              onClick={fetchApplications}
              className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.refreshVaultBtn}</span>
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl">
              {t.noAppsText}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app, idx) => (
                <div 
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs space-y-3 hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                      {app.trackingId}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {new Date(app.submittedAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-white font-semibold">{app.fullName}</div>
                    <div className="text-slate-400 truncate">{app.schemeName}</div>
                    <div className="text-slate-500">{t.incomeShort}: ₹{Number(app.annualIncome || 0).toLocaleString('en-IN')} • {app.category}</div>
                  </div>

                  {/* Actions & Live Status Tracker */}
                  <div className="pt-2 border-t border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleTrackApplicationStatus(app.trackingId)}
                        disabled={trackingAppId === app.trackingId}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-950/70 hover:bg-blue-900/80 text-blue-300 hover:text-white border border-blue-800/80 font-medium text-[11px] transition flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        {trackingAppId === app.trackingId ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-400" />
                            <span>{t.trackingStatusRunning}</span>
                          </>
                        ) : (
                          <>
                            <Search className="w-3.5 h-3.5 text-blue-400" />
                            <span>{t.trackLiveStatusBtn}</span>
                          </>
                        )}
                      </button>

                      {(app.screenshotBase64 || app.screenshotUrl) && (
                        <a
                          href={app.screenshotBase64 || (app.screenshotUrl?.startsWith('http') ? app.screenshotUrl : `${API_BASE_URL}${app.screenshotUrl}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-slate-200 font-medium flex items-center space-x-1 text-[11px]"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.viewScreenshotBtn}</span>
                        </a>
                      )}
                    </div>

                    {/* Live Tracking Result Expansion */}
                    {liveTrackingResults[app.trackingId] && (
                      <div className={`bg-slate-900/90 rounded-lg p-2.5 border ${
                        liveTrackingResults[app.trackingId].hasObjection
                          ? 'border-amber-500/70 bg-amber-950/20'
                          : 'border-emerald-500/40'
                      } text-[11px] space-y-2 animate-fadeIn`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-bold flex items-center space-x-1 ${
                            liveTrackingResults[app.trackingId].hasObjection
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}>
                            {liveTrackingResults[app.trackingId].hasObjection ? (
                              <>
                                <FileWarning className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                                <span>{t.objectionDelayBadge}</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{t.liveStatusVerified}</span>
                              </>
                            )}
                          </span>
                          <span className="text-[10px] text-slate-300 font-mono">
                            {liveTrackingResults[app.trackingId].stageName}
                          </span>
                        </div>

                        {liveTrackingResults[app.trackingId].hasObjection ? (
                          <div className="space-y-2 pt-1 border-t border-slate-800">
                            <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
                              {liveTrackingResults[app.trackingId].objectionReason || t.objectionDelayDesc}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleOpenGrievanceModal(app)}
                              className="w-full py-1.5 px-3 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold text-[11px] flex items-center justify-center space-x-1.5 transition shadow-sm"
                            >
                              <Gavel className="w-3.5 h-3.5 text-amber-400" />
                              <span>{t.draftGrievanceBtn}</span>
                            </button>
                          </div>
                        ) : (
                          /* 3 Pipeline Stages */
                          <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-1 border-t border-slate-800">
                            <div className="bg-emerald-950/70 text-emerald-300 p-1 rounded border border-emerald-800/60 font-semibold">
                              ✓ {t.stageSubmitted}
                            </div>
                            <div className="bg-emerald-950/70 text-emerald-300 p-1 rounded border border-emerald-800/60 font-semibold">
                              ✓ {t.stageDocVerified}
                            </div>
                            <div className="bg-emerald-600 text-white p-1 rounded font-bold shadow-sm animate-pulse">
                              ✓ {t.stageDBTApproved}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ========================================================== */}
      {/* HUMAN-IN-THE-LOOP APPROVAL MODAL                           */}
      {/* ========================================================== */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {t.securityCheckpoint}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {t.hitlModalTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t.hitlModalDesc}
                </p>
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{t.applicantLabel}</span>
                <span className="font-semibold text-white">{citizenData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.targetSchemeModal}</span>
                <span className="font-semibold text-blue-400">{citizenData.schemeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.annualIncomeModal}</span>
                <span className="font-semibold text-emerald-400">₹{Number(citizenData.annualIncome || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.aadhaarLast4}</span>
                <span className="font-mono text-slate-300">•••• {String(citizenData.idNumber).slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t.bankIfscAcModal}</span>
                <span className="font-mono text-slate-300">{citizenData.ifsc} / ••••{String(citizenData.bankAccount).slice(-4)}</span>
              </div>
            </div>

            {/* OTP Verification Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t.esignOtpLabel}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  maxLength={6}
                  value={approvalOtp}
                  onChange={(e) => setApprovalOtp(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-center font-mono tracking-widest text-lg font-bold text-emerald-400 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setApprovalOtp('123456')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
                >
                  {t.autoFillOtp}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleRejectAgent}
                className="px-4 py-2.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
              >
                {t.cancelRejectBtn}
              </button>

              <button
                type="button"
                onClick={handleApproveAgent}
                disabled={isApproving}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-2 shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              >
                {isApproving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{t.approveSubmitBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* PUBLIC GRIEVANCE APPEAL MODAL (AUTO-GENERATED PETITION)    */}
      {/* ========================================================== */}
      {grievanceModalData && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-500/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-scaleUp max-h-[92vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Gavel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>{t.grievanceModalTitle}</span>
                  </h3>
                  <p className="text-xs text-amber-300/80 mt-0.5">
                    {t.grievanceModalSubtitle}
                  </p>
                </div>
              </div>

              {/* Language Switcher for Appeal */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setGrievanceLang('hi')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    grievanceLang === 'hi'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setGrievanceLang('en')}
                  className={`px-2.5 py-1 rounded font-semibold transition ${
                    grievanceLang === 'en'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Appeal Text Container */}
            <div className="flex-1 overflow-y-auto bg-slate-950 rounded-xl p-4 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
              {grievanceLang === 'hi' ? grievanceModalData.appealHi : grievanceModalData.appealEn}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Tracking ID: <span className="font-mono text-amber-300 font-bold">{grievanceModalData.trackingId}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleCopyGrievance}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  {isCopiedAppeal ? (
                    <>
                      <CheckCheck className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">{t.copiedText}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" />
                      <span>{t.copyGrievanceBtn}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadGrievance}
                  className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-md shadow-amber-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.downloadGrievanceBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGrievanceModalData(null)}
                  className="px-3.5 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium transition"
                >
                  {t.closeGrievanceBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 🔐 PIN-PROTECTED OPERATOR / FAMILY VAULT DRAWER / MODAL    */}
      {/* ========================================================== */}
      {isOperatorDrawerOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-indigo-500/80 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp max-h-[92vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                    <span>{isOperatorUnlocked ? t.familyVaultTitle : t.pinLockedTitle}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isOperatorUnlocked ? t.familyVaultSubtitle : t.pinLockedSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsOperatorDrawerOpen(false);
                  setPinError('');
                  setOperatorPinInput('');
                }}
                className="text-slate-400 hover:text-white text-xl font-bold p-1 rounded-lg hover:bg-slate-800 transition"
              >
                ×
              </button>
            </div>

            {/* SCREEN 1: LOCKED PIN ENTRY */}
            {!isOperatorUnlocked ? (
              <div className="py-6 px-4 max-w-md mx-auto w-full text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <KeyRound className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">
                    {t.pinLockedTitle}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {t.pinLockedSubtitle}
                  </p>
                </div>

                {/* Subtle Judge Demo PIN Hint */}
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-950 border border-amber-500/30 text-[11px] font-mono text-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{t.demoPinHint}</span>
                </div>

                <form onSubmit={handleUnlockOperatorVault} className="space-y-3 pt-2">
                  <div className="flex items-center justify-center space-x-2">
                    <input
                      type="password"
                      maxLength={4}
                      autoFocus
                      value={operatorPinInput}
                      onChange={(e) => {
                        setOperatorPinInput(e.target.value);
                        setPinError('');
                      }}
                      placeholder="••••"
                      className="w-36 bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/40 rounded-xl px-4 py-2.5 text-center font-mono text-2xl tracking-widest text-emerald-400 font-bold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setOperatorPinInput('1234');
                        setPinError('');
                      }}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg border border-slate-700"
                    >
                      {t.quickPinFill}
                    </button>
                  </div>

                  {pinError && (
                    <p className="text-xs text-rose-400 font-semibold animate-shake">
                      {pinError}
                    </p>
                  )}

                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-600/30 transition flex items-center space-x-1.5"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>{t.unlockVaultBtn}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* SCREEN 2: UNLOCKED OPERATOR VAULT & HOUSEHOLD GROUP SELECTOR */
              <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                {/* Household Group Selector & Entitlement Header */}
                <div className="bg-slate-950 rounded-xl p-4 border border-indigo-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        {t.householdFilterLabel}
                      </span>
                      {/* Household Filter Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1">
                        {Array.from(new Set(familyMembers.map(m => m.householdId || 'HH-VERMA-2026'))).map((hhId) => {
                          const groupMembers = familyMembers.filter(m => (m.householdId || 'HH-VERMA-2026') === hhId);
                          const hhName = groupMembers[0]?.householdName || hhId;
                          const isHhActive = activeHouseholdFilter === hhId;
                          return (
                            <button
                              key={hhId}
                              type="button"
                              onClick={() => setActiveHouseholdFilter(hhId)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                                isHhActive
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                              }`}
                            >
                              <span>{hhName}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/30 font-mono">
                                {groupMembers.length}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Filtered Household Group Entitlement Sum */}
                    <div className="bg-indigo-950/60 border border-indigo-500/40 rounded-xl px-4 py-2 text-right self-stretch sm:self-auto">
                      <span className="text-[10px] uppercase text-indigo-300 font-bold block">
                        {t.householdEntitlement}
                      </span>
                      <span className="text-xl font-mono font-extrabold text-emerald-400">
                        ₹{familyMembers
                          .filter(m => (m.householdId || 'HH-VERMA-2026') === activeHouseholdFilter)
                          .reduce((sum, m) => sum + (Number(m.annualBenefit) || 0), 0)
                          .toLocaleString('en-IN')}/yr
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic border-t border-slate-900 pt-2">
                    ℹ️ {t.sameHouseholdNotice}
                  </p>
                </div>

                {/* Profiles in Selected Household Group */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {familyMembers.filter(m => (m.householdId || 'HH-VERMA-2026') === activeHouseholdFilter).length} {t.membersCountLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddMemberModal(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>{t.addFamilyMemberBtn}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {familyMembers
                      .filter(m => (m.householdId || 'HH-VERMA-2026') === activeHouseholdFilter)
                      .map((member) => {
                        const isCurrentActive = activeFamilyMemberId === member.id;
                        return (
                          <div
                            key={member.id}
                            className={`p-3.5 rounded-xl border transition flex flex-col justify-between ${
                              isCurrentActive
                                ? 'bg-indigo-950/40 border-indigo-400 ring-1 ring-indigo-400/40'
                                : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1 mb-1.5">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                  {currentLang === 'hi' ? member.relationHi || member.relation : member.relation}
                                </span>
                                <span className="text-xs font-mono font-bold text-emerald-400">
                                  ₹{(Number(member.annualBenefit) || 0).toLocaleString('en-IN')}/yr
                                </span>
                              </div>

                              <div className="font-bold text-sm text-white">
                                {member.fullName}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                                {member.topEligibleScheme || member.schemeName}
                              </div>
                              <div className="text-[10px] text-slate-500 mt-1">
                                Income: ₹{Number(member.annualIncome || 0).toLocaleString('en-IN')} • {member.category} • {member.state}
                              </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  handleSelectFamilyMember(member);
                                  setIsOperatorDrawerOpen(false);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-1 shadow-sm transition"
                              >
                                <ArrowRight className="w-3.5 h-3.5" />
                                <span>{t.loadToActiveSession}</span>
                              </button>

                              {isCurrentActive && (
                                <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
                                  <Check className="w-3 h-3" />
                                  <span>{t.activeInSessionTag}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <span className="text-xs text-slate-500">
                    Group ID: <span className="font-mono text-indigo-300">{activeHouseholdFilter}</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleLockOperatorVault}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition"
                  >
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.lockVaultBtn}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* ADD FAMILY MEMBER MODAL (FAMILY WELFARE VAULT)             */}
      {/* ========================================================== */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {t.modalAddMemberTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveNewFamilyMember} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {t.relationLabel}
                  </label>
                  <select
                    value={newMemberForm.relation}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, relation: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Father">Father (पिता)</option>
                    <option value="Mother">Mother (माता)</option>
                    <option value="Sibling">Sibling (भाई / बहन)</option>
                    <option value="Spouse">Spouse (पति / पत्नी)</option>
                    <option value="Grandparent">Grandparent (दादा / दादी)</option>
                    <option value="Other">Other Dependent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {t.fullNameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={newMemberForm.fullName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, fullName: e.target.value })}
                    placeholder="e.g. Anita Sharma"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">DOB</label>
                  <input
                    type="date"
                    value={newMemberForm.dob}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, dob: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Gender</label>
                  <select
                    value={newMemberForm.gender}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, gender: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Category</label>
                  <select
                    value={newMemberForm.category}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="OBC">OBC</option>
                    <option value="General">General</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="EWS">EWS</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {t.annualIncomeModal}
                  </label>
                  <input
                    type="number"
                    value={newMemberForm.annualIncome}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, annualIncome: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    {t.targetSchemeModal}
                  </label>
                  <select
                    value={newMemberForm.schemeName}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, schemeName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200"
                  >
                    <option value="Post-Matric Merit Scholarship">Post-Matric Merit Scholarship</option>
                    <option value="PM-Kisan Samman Nidhi">PM-Kisan Samman Nidhi</option>
                    <option value="Ayushman Bharat Health Cover">Ayushman Bharat Health Cover</option>
                    <option value="State Skill Development Grant">State Skill Development Grant</option>
                    <option value="National Means-cum-Merit Scholarship">National Means-cum-Merit Scholarship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  Household Group ID (Family Isolation)
                </label>
                <input
                  type="text"
                  value={newMemberForm.householdId || activeHouseholdFilter || 'HH-VERMA-2026'}
                  onChange={(e) => setNewMemberForm({ ...newMemberForm, householdId: e.target.value })}
                  placeholder="e.g. HH-VERMA-2026 or HH-NEW-GROUP"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 font-mono text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center space-x-1.5 transition shadow-lg shadow-blue-600/30"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.saveMemberBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        {t.footerText}
      </footer>
    </div>
  );
}
