import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, AlertCircle, AlertTriangle, FileText, 
  ArrowRight, ArrowLeft, Download, Printer, Landmark, 
  UserCheck, RefreshCw, Sparkles, ExternalLink, Search, Check, Clock
} from 'lucide-react';

const STATE_DISTRICT_MAP = {
  "Karnataka": ["Bengaluru Urban", "Mysuru", "Dharwad", "Mangaluru", "Belagavi"],
  "Maharashtra": ["Mumbai Suburban", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  "Uttar Pradesh": ["Lucknow", "Varanasi", "Kanpur Nagar", "Agra", "Prayagraj"],
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"]
};

const SCHEMES = [
  {
    id: "Post-Matric Merit Scholarship",
    name: "Post-Matric Merit Scholarship (PMS-2026)",
    ministry: "Ministry of Social Justice & Empowerment",
    maxIncome: 250000,
    benefit: "Up to ₹50,000 / year + tuition allowance"
  },
  {
    id: "PM-Kisan Samman Nidhi",
    name: "PM-Kisan Samman Nidhi (PM-KISAN)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    maxIncome: 300000,
    benefit: "₹6,000 / year in three equal instalments"
  },
  {
    id: "Ayushman Bharat Health Cover",
    name: "Ayushman Bharat PM-JAY (Health Cover)",
    ministry: "National Health Authority (NHA) & MoHFW",
    maxIncome: 250000,
    benefit: "₹5,00,000 / year Cashless Hospitalization"
  },
  {
    id: "State Skill Development Grant",
    name: "State Youth Skill Development & Apprenticeship Grant",
    ministry: "Ministry of Skill Development & Entrepreneurship",
    maxIncome: 400000,
    benefit: "₹25,000 one-time stipend + certified training"
  },
  {
    id: "National Means-cum-Merit Scholarship",
    name: "National Means-cum-Merit Scholarship (NMMSS)",
    ministry: "Department of School Education & Literacy, MoE",
    maxIncome: 350000,
    benefit: "₹12,000 / year (₹1,000 / month Direct DBT)"
  }
];

export default function MockGovPortal() {
  const [portalTab, setPortalTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('tab') === 'status' ? 'status' : 'apply';
    }
    return 'apply';
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    dob: '',
    gender: '',
    idNumber: '',
    mobile: '',
    state: '',
    district: '',
    // Step 2
    schemeName: 'Post-Matric Merit Scholarship',
    annualIncome: '',
    category: 'OBC',
    bankAccount: '',
    ifsc: '',
    // Step 3
    certificateFileName: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [districtOptions, setDistrictOptions] = useState([]);

  // Live Application Status Tracking State
  const [trackingQuery, setTrackingQuery] = useState('');
  const [trackedStatus, setTrackedStatus] = useState(null);
  const [isSearchingStatus, setIsSearchingStatus] = useState(false);

  // Multimodal Vision-DOM Fallback Simulation State (changes #ifsc to #bank_ifsc_v2)
  const [isLayoutV2, setIsLayoutV2] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('layout') === 'v2';
    } catch {
      return false;
    }
  });

  // Sync tab with URL if query changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const trackParam = params.get('trackingId');
      if (tabParam === 'status') {
        setPortalTab('status');
      }
      if (trackParam) {
        setTrackingQuery(trackParam);
        handleCheckStatusWithId(trackParam);
      }
    }
  }, []);

  // Sync cascading districts when state changes
  useEffect(() => {
    if (formData.state && STATE_DISTRICT_MAP[formData.state]) {
      setDistrictOptions(STATE_DISTRICT_MAP[formData.state]);
    } else {
      setDistrictOptions([]);
    }
  }, [formData.state]);

  const handleCheckStatusWithId = (id) => {
    const idToSearch = (id || trackingQuery || 'GOV-2026-48291').trim();
    const isObjection = idToSearch.toUpperCase().includes('OBJ') || 
                        idToSearch.toUpperCase().includes('DELAY') || 
                        idToSearch.toUpperCase().includes('GRIEVANCE');

    setIsSearchingStatus(true);
    setTimeout(() => {
      if (isObjection) {
        setTrackedStatus({
          trackingId: idToSearch,
          applicantName: formData.fullName || 'Ramesh Kumar Verma',
          schemeName: formData.schemeName || 'Post-Matric Merit Scholarship (PMS-2026)',
          category: formData.category || 'OBC',
          disbursementBank: formData.ifsc ? `IFSC ${formData.ifsc}` : 'IFSC SBIN0001234',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          currentStage: 'Document Objection / Delayed > 15 Days',
          currentStageHi: 'दस्तावेज़ आपत्ति / 15 दिनों से अधिक विलंब',
          hasObjection: true,
          delayDays: 18,
          objectionReason: 'Tahsildar Income Certificate seal unclear / verification pending over 15 days without disposal',
          statutoryClause: 'Section 4(1) of State Public Services Guarantee Act 2021 & CPGRAMS DBT Mandate (Mandatory 15-Day Service Delivery SLA Exceeded)',
          stages: [
            {
              id: 1,
              title: 'Submitted (आवेदन जमा हुआ)',
              detail: 'Form-8B digitally acknowledged (Received 18 calendar days ago)',
              status: 'COMPLETED',
              time: '18 Days Ago'
            },
            {
              id: 2,
              title: 'Document Objection Flagged (दस्तावेज़ आपत्ति दर्ज)',
              detail: 'Tahsildar verification delayed: Income certificate seal resolution defect noted by Nodal Officer',
              status: 'OBJECTION_FLAGGED',
              time: 'Delayed 18 Days'
            },
            {
              id: 3,
              title: 'DBT Disbursement On Hold (डीबीटी भुगतान रुका हुआ)',
              detail: 'Public Financial Management System disbursement on hold pending citizen appeal or rectification',
              status: 'ON_HOLD',
              time: 'Action Required'
            }
          ]
        });
      } else {
        setTrackedStatus({
          trackingId: idToSearch,
          applicantName: formData.fullName || 'Ramesh Kumar Verma',
          schemeName: formData.schemeName || 'Post-Matric Merit Scholarship (PMS-2026)',
          category: formData.category || 'OBC',
          disbursementBank: formData.ifsc ? `IFSC ${formData.ifsc}` : 'IFSC SBIN0001234',
          timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
          currentStage: 'DBT Disbursement Approved',
          currentStageHi: 'डीबीटी भुगतान स्वीकृत',
          hasObjection: false,
          stages: [
            {
              id: 1,
              title: 'Submitted (आवेदन जमा हुआ)',
              detail: 'Form-8B digitally acknowledged and assigned to Direct Benefit Transfer gateway',
              status: 'COMPLETED',
              time: '14:20 IST'
            },
            {
              id: 2,
              title: 'Document Verified (दस्तावेज़ सत्यापित)',
              detail: 'Income certificate authenticated (< ₹2,50,000) & 12-digit Aadhaar verified',
              status: 'COMPLETED',
              time: '14:22 IST'
            },
            {
              id: 3,
              title: 'DBT Disbursement Approved (डीबीटी भुगतान स्वीकृत)',
              detail: 'Public Financial Management System (PFMS) authorized ₹50,000 subsidy release',
              status: 'APPROVED',
              time: 'Live Verified'
            }
          ]
        });
      }
      setIsSearchingStatus(false);
    }, 500);
  };

  const handleCheckStatus = (e) => {
    if (e) e.preventDefault();
    handleCheckStatusWithId(trackingQuery);
  };

  // Sync cascading districts when state changes
  useEffect(() => {
    if (formData.state && STATE_DISTRICT_MAP[formData.state]) {
      setDistrictOptions(STATE_DISTRICT_MAP[formData.state]);
    } else {
      setDistrictOptions([]);
    }
  }, [formData.state]);

  const validateField = (name, value) => {
    let err = null;
    if (name === 'ifsc') {
      if (!value) {
        err = "Valid 11-character IFSC code is required";
      } else if (value !== value.toUpperCase() || /[^A-Z0-9]/.test(value)) {
        err = "IFSC code must be strictly uppercase alphanumeric characters (e.g. SBIN0001234)";
      } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(value)) {
        err = "Valid 11-character IFSC code required (e.g., SBIN0001234)";
      }
    } else if (name === 'annualIncome') {
      if (!value || isNaN(value) || Number(value) <= 0) {
        err = "Valid numeric annual family income is required";
      }
    } else if (name === 'idNumber') {
      const clean = String(value || '').replace(/\s+/g, '');
      if (!clean || !/^\d{12}$/.test(clean)) {
        err = "Aadhaar must be exactly 12 numeric digits";
      }
    } else if (name === 'mobile') {
      const clean = String(value || '').replace(/\s+/g, '');
      if (!clean || !/^\d{10}$/.test(clean)) {
        err = "Mobile number must be 10 numeric digits";
      }
    }
    return err;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldErr = validateField(name, value);
    if (fieldErr) {
      setErrors(prev => ({ ...prev, [name]: fieldErr }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'file') {
      const file = files[0];
      setFormData(prev => ({
        ...prev,
        certificateFileName: file ? file.name : ''
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      // Real-time inline field validation
      const fieldErr = validateField(name, value);
      if (fieldErr) {
        setErrors(prev => ({ ...prev, [name]: fieldErr }));
      } else if (errors[name]) {
        setErrors(prev => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
      }
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    
    // Aadhaar / ID 12 digit check
    const cleanId = formData.idNumber.replace(/\s+/g, '');
    if (!cleanId) {
      newErrors.idNumber = "12-digit Aadhaar / ID number is required";
    } else if (!/^\d{12}$/.test(cleanId)) {
      newErrors.idNumber = "Aadhaar must be exactly 12 numeric digits";
    }

    // Mobile 10 digit check
    const cleanMobile = formData.mobile.replace(/\s+/g, '');
    if (!cleanMobile) {
      newErrors.mobile = "10-digit mobile number is required";
    } else if (!/^\d{10}$/.test(cleanMobile)) {
      newErrors.mobile = "Mobile number must be 10 numeric digits";
    }

    if (!formData.state) newErrors.state = "State selection is required";
    if (!formData.district) newErrors.district = "District selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.schemeName) newErrors.schemeName = "Scheme selection is required";
    if (!formData.annualIncome || isNaN(formData.annualIncome) || Number(formData.annualIncome) <= 0) {
      newErrors.annualIncome = "Valid numeric annual family income is required";
    }
    if (!formData.category) newErrors.category = "Social category is required";
    if (!formData.bankAccount || formData.bankAccount.length < 8) {
      newErrors.bankAccount = "Valid bank account number is required (min 8 digits)";
    }
    if (!formData.ifsc) {
      newErrors.ifsc = "Valid 11-character IFSC code is required";
    } else if (formData.ifsc !== formData.ifsc.toUpperCase() || /[^A-Z0-9]/.test(formData.ifsc)) {
      newErrors.ifsc = "IFSC code must be strictly uppercase alphanumeric characters (e.g. SBIN0001234)";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      newErrors.ifsc = "Valid 11-character uppercase IFSC code is required (e.g., SBIN0001234)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.certificateFileName) {
      newErrors.certificateFile = "Please upload an Income or ID certificate (.pdf, .jpg, .png)";
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must declare that all information is truthful under penalty of law";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const trackingId = `GOV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      
      const result = {
        trackingId,
        timestamp,
        ...formData
      };
      
      setSubmissionResult(result);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Notify parent/any listeners if opened in window or iframe
      if (window.opener) {
        window.opener.postMessage({ type: 'APPLICATION_SUBMITTED', trackingId }, '*');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Tricolor Official Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

      {/* Official Government Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gov-blue text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-orange-500">
              <Landmark className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                  eSeva 2.0 Official Portal
                </span>
                <span className="text-xs text-slate-500">Ministry of Electronics & Information Technology</span>
              </div>
              <h1 className="text-lg md:text-xl font-bold text-gov-navy leading-tight">
                National Citizen Welfare & Scholarship Portal
              </h1>
              <p className="text-xs text-slate-500">Direct Benefit Transfer (DBT) Automated Verification System</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-semibold text-slate-700">Digital India Initiative</span>
              <span className="text-slate-500">Secure 256-bit Encrypted Session</span>
            </div>
            <div className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md flex items-center space-x-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified e-Gov Gateway</span>
            </div>
          </div>
        </div>

        {/* Navigation sub-bar */}
        <div className="bg-gov-navy text-white text-xs px-4 py-2 border-t border-slate-700/50">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <button
                id="tab-apply-btn"
                type="button"
                onClick={() => setPortalTab('apply')}
                className={`px-3 py-1.5 rounded transition font-medium flex items-center space-x-1.5 ${
                  portalTab === 'apply'
                    ? 'bg-orange-500 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Online Application Form (Form-8B)</span>
              </button>

              <button
                id="tab-status-btn"
                type="button"
                onClick={() => setPortalTab('status')}
                className={`px-3 py-1.5 rounded transition font-medium flex items-center space-x-1.5 ${
                  portalTab === 'status'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Application Status (आवेदन स्थिति)</span>
              </button>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              {/* Multimodal Vision-DOM Testing Toggle */}
              <button
                type="button"
                id="toggleLayoutV2Btn"
                onClick={() => setIsLayoutV2(prev => !prev)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 border shadow-sm ${
                  isLayoutV2
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold ring-2 ring-amber-400/50 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                }`}
                title="Simulates government portal DOM change: alters IFSC element ID from #ifsc to #bank_ifsc_v2 to test agent Vision-DOM self-healing live"
              >
                <span>⚡ {isLayoutV2 ? 'Portal Layout v2 Active (#bank_ifsc_v2)' : 'Simulate Portal Layout Change'}</span>
              </button>
              <span>|</span>
              <span>Language: <strong className="text-white">English / हिन्दी</strong></span>
              <span>|</span>
              <span className="text-emerald-400 font-mono">Live Demo Mock Endpoint</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1">
        {portalTab === 'status' ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gov-navy to-slate-900 text-white p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Live DBT Status Verification
                  </span>
                  <h2 className="text-xl font-bold mt-1">Autonomous Application Status Tracker</h2>
                  <p className="text-xs text-slate-300">Direct query against Public Financial Management System (PFMS) & State Portals</p>
                </div>
              </div>

              {/* Status Lookup Search Form */}
              <form onSubmit={handleCheckStatus} className="mt-6 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    id="trackingIdInput"
                    type="text"
                    value={trackingQuery}
                    onChange={(e) => setTrackingQuery(e.target.value)}
                    placeholder="Enter Tracking ID (e.g. GOV-2026-84912)"
                    className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-400 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  id="checkStatusBtn"
                  type="submit"
                  disabled={isSearchingStatus}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-md transition flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isSearchingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Portal...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Check Live Status</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Results Container */}
            <div id="statusResult" className="p-6 md:p-8 space-y-6">
              {trackedStatus ? (
                <div className="space-y-6">
                  {/* Status Banner */}
                  <div className={`border rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    trackedStatus.hasObjection 
                      ? 'bg-rose-50/90 border-rose-300' 
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <div className="space-y-1">
                      <div className={`text-xs font-semibold uppercase tracking-wider ${
                        trackedStatus.hasObjection ? 'text-rose-800' : 'text-emerald-800'
                      }`}>
                        Current Application Stage
                      </div>
                      <div id="currentStageText" className={`text-xl font-bold flex items-center space-x-2 ${
                        trackedStatus.hasObjection ? 'text-rose-950' : 'text-emerald-950'
                      }`}>
                        {trackedStatus.hasObjection ? (
                          <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        )}
                        <span>{trackedStatus.currentStage}</span>
                      </div>
                      <div className={`text-xs ${trackedStatus.hasObjection ? 'text-rose-700' : 'text-emerald-700'}`}>
                        Official Tracking ID: <strong id="statusResultTrackingId" className={`font-mono ${trackedStatus.hasObjection ? 'text-rose-900' : 'text-emerald-900'}`}>{trackedStatus.trackingId}</strong>
                      </div>
                    </div>

                    <div className={`text-right text-xs bg-white/80 rounded-lg p-3 border ${
                      trackedStatus.hasObjection ? 'border-rose-200 text-rose-900' : 'border-emerald-100 text-slate-600'
                    }`}>
                      <div>Verified Timestamp: <strong>{trackedStatus.timestamp}</strong></div>
                      <div>DBT Bank: <span className="font-mono">{trackedStatus.disbursementBank}</span></div>
                    </div>
                  </div>

                  {/* Objection Alert Card (when objection or delay is flagged) */}
                  {trackedStatus.hasObjection && (
                    <div id="objectionAlert" data-status="objection" className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5 text-xs space-y-2.5 shadow-sm">
                      <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <span>Public Services SLA Delay Detected ({trackedStatus.delayDays} Days Overdue)</span>
                      </div>
                      <div className="text-amber-950 leading-relaxed">
                        <span className="font-semibold text-amber-900">Flagged Objection Reason: </span>
                        <span id="objectionReasonText">{trackedStatus.objectionReason}</span>
                      </div>
                      <div className="text-amber-800 text-[11px] pt-1 border-t border-amber-200">
                        <span className="font-semibold">Legal Infraction: </span>
                        <span id="statutoryViolationText">{trackedStatus.statutoryClause}</span>
                      </div>
                    </div>
                  )}

                  {/* 3 Live Verification Stages */}
                  <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gov-blue" />
                      <span>Three-Stage Automated Welfare Verification Pipeline</span>
                    </h3>

                    <div className="space-y-4">
                      {trackedStatus.stages.map((stage, idx) => (
                        <div key={idx} className="flex items-start space-x-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                            stage.status === 'APPROVED' 
                              ? 'bg-emerald-600 text-white shadow-md animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}>
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-sm text-slate-900">{stage.title}</span>
                              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {stage.time}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{stage.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metadata Summary Card */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-100 p-4 rounded-lg text-slate-700">
                    <div>
                      <span className="text-slate-500 block">Applicant:</span>
                      <strong className="text-slate-900">{trackedStatus.applicantName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Scheme:</span>
                      <strong className="text-slate-900 truncate block">{trackedStatus.schemeName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Social Category:</span>
                      <strong className="text-slate-900">{trackedStatus.category}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">PFMS Status:</span>
                      <strong className="text-emerald-700">Direct Bank Mandate Active</strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 space-y-3">
                  <Landmark className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-sm font-medium">Enter your 11-digit Government Tracking ID to query real-time stages.</p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleCheckStatusWithId('GOV-2026-84912')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 font-semibold transition flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Demo Approved Record (GOV-2026-84912)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCheckStatusWithId('GOV-2026-OBJ-9812')}
                      className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 font-semibold transition flex items-center space-x-1"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Demo Objection / Delayed &gt; 15 Days (GOV-2026-OBJ-9812)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : submissionResult ? (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-6 text-center relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight">Application Submitted Successfully</h2>
              <p className="text-emerald-100 text-sm mt-1">
                Your direct benefit transfer request has been acknowledged by the portal.
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* Tracking ID Hero Box */}
              <div className="bg-emerald-50 border-2 border-dashed border-emerald-400 rounded-xl p-5 text-center">
                <div className="text-xs uppercase tracking-wider font-semibold text-emerald-700 mb-1">
                  Official Application Tracking ID
                </div>
                <div id="tracking-id-display" className="text-3xl md:text-4xl font-mono font-extrabold text-emerald-950 tracking-wider">
                  {submissionResult.trackingId}
                </div>
                <div className="text-xs text-emerald-800 mt-2 flex items-center justify-center space-x-2">
                  <span>Timestamp: <strong>{submissionResult.timestamp}</strong></span>
                  <span>•</span>
                  <span>Status: <strong className="text-emerald-700">Under AI Pre-Verification</strong></span>
                </div>
              </div>

              {/* Receipt Summary Grid */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 font-semibold text-sm text-slate-700 flex justify-between">
                  <span>Application Summary Receipt</span>
                  <span className="text-xs text-slate-500">Form Ref: DBT-2026-X8</span>
                </div>
                <dl className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-sm">
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Applicant Name:</dt>
                      <dd className="font-semibold text-slate-800">{submissionResult.fullName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Date of Birth:</dt>
                      <dd className="font-medium text-slate-800">{submissionResult.dob}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Aadhaar (Last 4 Digits):</dt>
                      <dd className="font-mono text-slate-800">XXXX-XXXX-{submissionResult.idNumber.slice(-4)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Mobile Number:</dt>
                      <dd className="font-medium text-slate-800">{submissionResult.mobile}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">State & District:</dt>
                      <dd className="font-medium text-slate-800">{submissionResult.district}, {submissionResult.state}</dd>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Selected Scheme:</dt>
                      <dd className="font-semibold text-gov-blue">{submissionResult.schemeName}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Social Category:</dt>
                      <dd className="font-medium text-slate-800">{submissionResult.category}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Declared Annual Income:</dt>
                      <dd className="font-semibold text-slate-900">₹{Number(submissionResult.annualIncome).toLocaleString('en-IN')}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Bank IFSC / A/C:</dt>
                      <dd className="font-mono text-slate-800">{submissionResult.ifsc} / ••••{submissionResult.bankAccount.slice(-4)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Attached Certificate:</dt>
                      <dd className="text-xs font-mono text-slate-700 truncate max-w-[180px]">{submissionResult.certificateFileName}</dd>
                    </div>
                  </div>
                </dl>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center space-x-2 text-sm font-medium transition"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Print Official Acknowledgment</span>
                </button>

                <div className="flex space-x-3">
                  <a
                    href="/"
                    className="px-5 py-2.5 bg-gov-blue text-white rounded-lg hover:bg-gov-navy text-sm font-medium transition flex items-center space-x-2 shadow-sm"
                  >
                    <span>Return to Citizen Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            {/* Step Wizard Header */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 md:p-6">
              <div className="flex items-center justify-between max-w-2xl mx-auto">
                {/* Step 1 Pill */}
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 1 
                      ? 'bg-gov-blue text-white ring-4 ring-blue-100' 
                      : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                  </div>
                  <span className={`text-xs md:text-sm font-semibold ${currentStep === 1 ? 'text-gov-blue' : 'text-slate-600'}`}>
                    Personal Identity
                  </span>
                </div>

                <div className={`h-0.5 flex-1 mx-2 md:mx-4 ${currentStep > 1 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

                {/* Step 2 Pill */}
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 2 
                      ? 'bg-gov-blue text-white ring-4 ring-blue-100' 
                      : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {currentStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                  </div>
                  <span className={`text-xs md:text-sm font-semibold ${currentStep === 2 ? 'text-gov-blue' : 'text-slate-600'}`}>
                    Scheme & Income
                  </span>
                </div>

                <div className={`h-0.5 flex-1 mx-2 md:mx-4 ${currentStep > 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

                {/* Step 3 Pill */}
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    currentStep === 3 
                      ? 'bg-gov-blue text-white ring-4 ring-blue-100' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    3
                  </div>
                  <span className={`text-xs md:text-sm font-semibold ${currentStep === 3 ? 'text-gov-blue' : 'text-slate-600'}`}>
                    Review & Upload
                  </span>
                </div>
              </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleFinalSubmit} className="p-6 md:p-8 space-y-6">
              {/* STEP 1: Personal & Identity Details */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-xl font-bold text-gov-navy flex items-center space-x-2">
                      <UserCheck className="w-5 h-5 text-gov-blue" />
                      <span>Step 1: Personal & Identity Details</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Provide citizen credentials matching national identification documents.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name (as per ID/Aadhaar) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        aria-label="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. Ramesh Kumar Verma"
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                          errors.fullName ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.fullName && <p data-error-for="fullName" className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label htmlFor="dob" className="block text-xs font-semibold text-slate-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="dob"
                        name="dob"
                        type="date"
                        aria-label="Date of Birth"
                        value={formData.dob}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                          errors.dob ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.dob && <p data-error-for="dob" className="text-red-500 text-xs mt-1">{errors.dob}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                      <label htmlFor="gender" className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gender"
                        name="gender"
                        aria-label="Gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white ${
                          errors.gender ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other / Transgender</option>
                      </select>
                      {errors.gender && <p data-error-for="gender" className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                    </div>

                    {/* Aadhaar / National ID */}
                    <div>
                      <label htmlFor="idNumber" className="block text-xs font-semibold text-slate-700 mb-1">
                        Aadhaar / National ID Number (12 Digits) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="idNumber"
                        name="idNumber"
                        type="text"
                        maxLength={12}
                        aria-label="Aadhaar / National ID Number"
                        value={formData.idNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="123456789012"
                        className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 ${
                          errors.idNumber ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.idNumber && <p data-error-for="idNumber" className="text-red-500 text-xs mt-1">{errors.idNumber}</p>}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label htmlFor="mobile" className="block text-xs font-semibold text-slate-700 mb-1">
                        Registered Mobile Number (10 Digits) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="mobile"
                        name="mobile"
                        type="tel"
                        maxLength={10}
                        aria-label="Mobile Number"
                        value={formData.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="9876543210"
                        className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 ${
                          errors.mobile ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.mobile && <p data-error-for="mobile" className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                    </div>

                    {/* State Dropdown */}
                    <div>
                      <label htmlFor="state" className="block text-xs font-semibold text-slate-700 mb-1">
                        Domicile State <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="state"
                        name="state"
                        aria-label="State"
                        value={formData.state}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white ${
                          errors.state ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      >
                        <option value="">Select State</option>
                        {Object.keys(STATE_DISTRICT_MAP).map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      {errors.state && <p data-error-for="state" className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>

                    {/* Cascading District Dropdown */}
                    <div>
                      <label htmlFor="district" className="block text-xs font-semibold text-slate-700 mb-1">
                        District <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="district"
                        name="district"
                        aria-label="District"
                        disabled={!formData.state}
                        value={formData.district}
                        onChange={handleChange}
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 bg-white ${
                          !formData.state ? 'bg-slate-100 cursor-not-allowed' : ''
                        } ${errors.district ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'}`}
                      >
                        <option value="">{formData.state ? 'Select District' : 'First select a state'}</option>
                        {districtOptions.map(dist => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                      {errors.district && <p data-error-for="district" className="text-red-500 text-xs mt-1">{errors.district}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      id="step1-next-btn"
                      type="button"
                      onClick={handleNextStep1}
                      className="px-6 py-2.5 bg-gov-blue text-white rounded-lg hover:bg-gov-navy text-sm font-semibold transition flex items-center space-x-2 shadow-sm"
                    >
                      <span>Proceed to Scheme Selection</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Scheme & Income Details */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Dynamic Layout v2 Notification Banner */}
                  {isLayoutV2 && (
                    <div id="layoutV2AlertBanner" className="bg-amber-50 border-l-4 border-amber-500 p-3.5 rounded-r-lg text-xs text-amber-900 flex items-center justify-between shadow-sm animate-fadeIn">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
                        <span>
                          <strong>Dynamic Layout v2 Active:</strong> The IFSC Code input element ID has been altered to <code>id="bank_ifsc_v2"</code> (simulating live portal DOM breaking change). Playwright will engage Multimodal Vision-DOM Self-Healing live.
                        </span>
                      </div>
                      <span className="text-[10px] font-mono bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold ml-2">
                        v2-dynamic
                      </span>
                    </div>
                  )}

                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-xl font-bold text-gov-navy flex items-center space-x-2">
                      <Landmark className="w-5 h-5 text-gov-blue" />
                      <span>Step 2: Welfare Scheme & Income Eligibility</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Select target welfare benefit and declare annual household income for DBT eligibility.
                    </p>
                  </div>

                  {/* Scheme Selection */}
                  <div>
                    <label htmlFor="schemeName" className="block text-xs font-semibold text-slate-700 mb-1">
                      Welfare Scheme Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="schemeName"
                      name="schemeName"
                      aria-label="Welfare Scheme Selection"
                      value={formData.schemeName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                    >
                      {SCHEMES.map(sc => (
                        <option key={sc.id} value={sc.id}>
                          {sc.name} — ({sc.benefit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Annual Income */}
                    <div>
                      <label htmlFor="annualIncome" className="block text-xs font-semibold text-slate-700 mb-1">
                        Annual Household Income (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="annualIncome"
                        name="annualIncome"
                        type="number"
                        aria-label="Annual Family Income"
                        value={formData.annualIncome}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 180000"
                        className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 ${
                          errors.annualIncome ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      <p className="text-xs text-slate-500 mt-1">Must be under ₹2,50,000 for standard merit scholarship.</p>
                      {errors.annualIncome && <p data-error-for="annualIncome" className="text-red-500 text-xs mt-1">{errors.annualIncome}</p>}
                    </div>

                    {/* Social Category */}
                    <div>
                      <label htmlFor="category" className="block text-xs font-semibold text-slate-700 mb-1">
                        Social Reservation Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        aria-label="Social Category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                      >
                        <option value="General">General / Unreserved</option>
                        <option value="OBC">OBC (Other Backward Classes)</option>
                        <option value="SC">SC (Scheduled Caste)</option>
                        <option value="ST">ST (Scheduled Tribe)</option>
                        <option value="EWS">EWS (Economically Weaker Section)</option>
                      </select>
                      {errors.category && <p data-error-for="category" className="text-red-500 text-xs mt-1">{errors.category}</p>}
                    </div>

                    {/* Bank Account */}
                    <div>
                      <label htmlFor="bankAccount" className="block text-xs font-semibold text-slate-700 mb-1">
                        Direct Benefit Bank Account Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="bankAccount"
                        name="bankAccount"
                        type="text"
                        aria-label="Bank Account Number"
                        value={formData.bankAccount}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 918237465019"
                        className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm focus:outline-none focus:ring-2 ${
                          errors.bankAccount ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.bankAccount && <p data-error-for="bankAccount" className="text-red-500 text-xs mt-1">{errors.bankAccount}</p>}
                    </div>

                    {/* IFSC Code */}
                    <div>
                      <label htmlFor={isLayoutV2 ? "bank_ifsc_v2" : "ifsc"} className="block text-xs font-semibold text-slate-700 mb-1">
                        Bank Branch IFSC Code <span className="text-red-500">*</span>
                        {isLayoutV2 && <span className="text-amber-600 font-mono text-[10px] ml-1.5">(id="bank_ifsc_v2")</span>}
                      </label>
                      <input
                        id={isLayoutV2 ? "bank_ifsc_v2" : "ifsc"}
                        name="ifsc"
                        type="text"
                        maxLength={11}
                        aria-label="Bank Branch IFSC Code"
                        value={formData.ifsc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="SBIN0001234"
                        data-portal-layout={isLayoutV2 ? "v2-dynamic" : "v1-standard"}
                        className={`w-full px-3.5 py-2.5 rounded-lg border font-mono uppercase text-sm focus:outline-none focus:ring-2 ${
                          errors.ifsc ? 'border-red-400 focus:ring-red-200' : 'border-slate-300 focus:ring-blue-200'
                        }`}
                      />
                      {errors.ifsc && <p data-error-for="ifsc" className="text-red-500 text-xs mt-1">{errors.ifsc}</p>}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 1</span>
                    </button>

                    <button
                      id="step2-next-btn"
                      type="button"
                      onClick={handleNextStep2}
                      className="px-6 py-2.5 bg-gov-blue text-white rounded-lg hover:bg-gov-navy text-sm font-semibold transition flex items-center space-x-2 shadow-sm"
                    >
                      <span>Proceed to Document Upload</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Document Upload & Final Review */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="border-b border-slate-100 pb-3">
                    <h2 className="text-xl font-bold text-gov-navy flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-gov-blue" />
                      <span>Step 3: Document Upload & Human Approval Review</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload supporting income / caste certificate and verify application details before final sign-off.
                    </p>
                  </div>

                  {/* File Upload Box */}
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-gov-blue transition bg-slate-50">
                    <FileText className="w-10 h-10 text-gov-blue mx-auto mb-2 opacity-80" />
                    <label htmlFor="certificateFile" className="block text-sm font-semibold text-slate-700 cursor-pointer">
                      <span>Click to upload Income / Residence / ID Certificate</span>
                      <input
                        id="certificateFile"
                        name="certificateFile"
                        type="file"
                        aria-label="Upload Income or ID Certificate"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="text-xs text-slate-500 mt-1">Supports PDF, JPG, PNG (Max 5MB)</p>
                    {formData.certificateFileName ? (
                      <div className="mt-3 inline-flex items-center space-x-2 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-mono font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Attached: {formData.certificateFileName}</span>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs text-slate-400 italic">No document selected yet</div>
                    )}
                    {errors.certificateFile && <p data-error-for="certificateFile" className="text-red-500 text-xs mt-2">{errors.certificateFile}</p>}
                  </div>

                  {/* Comprehensive Review Summary Box */}
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-gov-blue" />
                      <span>Pre-Submission Verification Summary</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-slate-500 block">Applicant Name:</span>
                        <span className="font-semibold text-slate-800">{formData.fullName || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Date of Birth:</span>
                        <span className="font-semibold text-slate-800">{formData.dob || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">ID (Aadhaar):</span>
                        <span className="font-mono font-semibold text-slate-800">{formData.idNumber || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Mobile:</span>
                        <span className="font-semibold text-slate-800">{formData.mobile || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Location:</span>
                        <span className="font-semibold text-slate-800">{formData.district}, {formData.state}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Social Category:</span>
                        <span className="font-semibold text-slate-800">{formData.category}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Target Scheme:</span>
                        <span className="font-bold text-gov-blue">{formData.schemeName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Annual Income:</span>
                        <span className="font-semibold text-emerald-700">₹{Number(formData.annualIncome || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Bank Account:</span>
                        <span className="font-mono text-slate-800">{formData.bankAccount || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">IFSC Code:</span>
                        <span className="font-mono text-slate-800">{formData.ifsc || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Declaration Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        id="termsCheck"
                        name="termsAccepted"
                        type="checkbox"
                        aria-label="I hereby declare that all the information provided above is authentic"
                        checked={formData.termsAccepted}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-gov-blue focus:ring-blue-400 rounded border-slate-300"
                      />
                      <span className="text-xs text-slate-600 leading-relaxed">
                        I hereby declare under penalty of perjury that all particulars stated above and attached
                        certificates are authentic, correct, and verified with my Aadhaar consent for DBT disbursement.
                      </span>
                    </label>
                    {errors.termsAccepted && <p data-error-for="termsAccepted" className="text-red-500 text-xs mt-1">{errors.termsAccepted}</p>}
                  </div>

                  {/* Navigation & Submit buttons */}
                  <div className="pt-4 flex justify-between items-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-5 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium transition flex items-center space-x-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Step 2</span>
                    </button>

                    {/* Human-in-the-loop target button */}
                    <button
                      id="final-submit-btn"
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow-md transition flex items-center space-x-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Transmitting to Welfare Gateway...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Final Submit Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </main>

      {/* Official Gov Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="font-semibold text-slate-300">National Informatics Division — Ministry of Electronics & IT</p>
            <p className="mt-0.5">Designed for Autonomous AI Public Service & Bureaucracy Execution Agent Demo</p>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Audit Trail Compliance</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
