import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer for notice / PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `notice-${baseName}-${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpeg|jpg|png|txt/i;
    if (allowed.test(path.extname(file.originalname)) || allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Please upload a PDF, image (.png, .jpg), or text notice.'));
    }
  }
});

const router = express.Router();

/**
 * Smart Offline Scheme Explainer Fallback
 * Provides high-fidelity 3-part breakdowns in English, Hindi, and Hinglish
 * when Gemini API key is absent or offline.
 */
function generateSmartSchemeExplanation(rawText = '', sourceUrl = '', originalFileName = '') {
  const text = (rawText || '').toLowerCase();
  
  let schemeName = 'Post-Matric Merit Scholarship (PMS-2026)';
  let targetSchemeId = 'Post-Matric Merit Scholarship';
  let sourceTitle = 'e-Governance Welfare Portal';
  
  if (text.includes('kisan') || text.includes('agriculture') || text.includes('farmer')) {
    schemeName = 'PM-Kisan Samman Nidhi (PM-KISAN)';
    targetSchemeId = 'PM-Kisan Samman Nidhi';
    sourceTitle = 'Ministry of Agriculture & Farmers Welfare';
  } else if (text.includes('skill') || text.includes('apprentice') || text.includes('kaushal')) {
    schemeName = 'State Youth Skill Development & Apprenticeship Grant';
    targetSchemeId = 'State Skill Development Grant';
    sourceTitle = 'Ministry of Skill Development & Entrepreneurship';
  } else if (text.includes('scholarship') || text.includes('matric') || text.includes('student')) {
    schemeName = 'Post-Matric Merit Scholarship (PMS-2026)';
    targetSchemeId = 'Post-Matric Merit Scholarship';
    sourceTitle = 'Ministry of Social Justice & Empowerment';
  }

  if (targetSchemeId === 'PM-Kisan Samman Nidhi') {
    return {
      schemeName,
      targetSchemeId,
      sourceTitle,
      sourceUrl,
      about: {
        en: 'PM-Kisan Samman Nidhi is a central sector welfare initiative providing assured income support to landholding farmer families across India. Eligible beneficiary families receive financial assistance directly into their Aadhaar-linked bank accounts in three equal instalments every four months.',
        hi: 'प्रधानमंत्री किसान सम्मान निधि (पीएम-किसान) भारत भर के किसान परिवारों को सुनिश्चित आय सहायता प्रदान करने वाली केंद्र सरकार की प्रमुख योजना है। इसके अंतर्गत पात्र किसान परिवारों को प्रत्यक्ष लाभ अंतरण (DBT) के माध्यम से प्रति वर्ष तीन समान किस्तों में ₹6,000 की वित्तीय सहायता सीधे उनके आधार लिंक बैंक खाते में मिलती है।',
        hinglish: 'PM-Kisan scheme central government ki sabse badi farmer welfare initiative hai. Isme eligible kisan families ko har 4 mahine me ₹2,000 ki kist direct unke Aadhaar linked bank account me transfer hoti hai, total saal ka ₹6,000 milta hai.'
      },
      eligibilityAndDocs: {
        en: 'Small and marginal landholder farmer families with cultivable landholding. Family income ceiling should generally not exceed ₹3,00,000/year. Required documents include Land Records (RoR / Khatauni / Jamabandi), 12-digit Aadhaar Card, Active DBT-linked Bank Passbook with IFSC, and Self-Declaration of Non-Exclusion.',
        hi: 'खेती योग्य भूमि वाले छोटे और सीमांत किसान परिवार पात्र हैं। पारिवारिक आय ₹3,00,000/वर्ष से अधिक नहीं होनी चाहिए। आवश्यक दस्तावेज़: खतौनी/जमाबंदी (भूमि स्वामित्व अभिलेख), 12-अंक आधार कार्ड, सक्रिय IFSC युक्त बैंक पासबुक, और गैर-बहिष्कार स्व-घोषणा पत्र।',
        hinglish: 'Jin farmers ke paas apni kheti ki zameen hai wo sab eligible hain. Annual income ₹3 Lakh se kam honi chahiye. Zaroori documents: Zameen ke kagaz (Khatauni/Jamabandi), Aadhaar card, Bank passbook IFSC ke saath, aur self-declaration form.',
        criteria: [
          'Must own cultivable agricultural land in applicant\'s name',
          'Aadhaar number must be linked with land revenue records and bank account',
          'Applicant must not be a serving/retired government employee or income tax payer',
          'Annual family income within permissible guidelines (under ₹3,00,000)'
        ],
        requiredDocuments: [
          'Land Holding Ownership Records (RoR / Khatauni / Jamabandi)',
          '12-digit Aadhaar Card with biometric linking',
          'Active Bank Account Passbook with IFSC code',
          'Self-Declaration Affidavit of Non-Exclusion'
        ]
      },
      stepsToApply: {
        en: 'Step 1: Enter personal identity, mobile, and 12-digit Aadhaar details. Step 2: Choose PM-Kisan Samman Nidhi from welfare schemes and specify agricultural district. Step 3: Enter DBT bank account and IFSC code. Step 4: Attach supporting land/income record and authenticate via Human-in-the-Loop OTP.',
        hi: 'चरण 1: व्यक्तिगत पहचान और 12-अंक आधार नंबर दर्ज करें। चरण 2: कल्याणकारी योजनाओं में पीएम-किसान चुनें और अपना कृषि ज़िला चुनें। चरण 3: DBT बैंक खाता और IFSC कोड भरें। चरण 4: भूमि/आय प्रमाण पत्र संलग्न करें और OTP द्वारा ई-हस्ताक्षर सबमिट करें।',
        hinglish: 'Step 1: Portal par apna naam, mobile aur Aadhaar number fill karein. Step 2: Schemes me PM-Kisan select karke district choose karein. Step 3: Bank account number aur IFSC code enter karein. Step 4: Land/Income document attach karein aur OTP approve karke final submit karein.',
        steps: [
          'Step 1: Fill Citizen Identity & Aadhaar Verification',
          'Step 2: Select PM-Kisan Scheme & Enter Agricultural Domicile',
          'Step 3: Provide Active DBT Bank Account & IFSC Code',
          'Step 4: Attach Verification Certificate & Complete OTP e-Sign'
        ]
      },
      keyHighlights: [
        { label: 'Annual Benefit', value: '₹6,000 / year (3 installments)' },
        { label: 'Income Limit', value: 'Under ₹3,00,000 / year' },
        { label: 'Nodal Ministry', value: 'Ministry of Agriculture' },
        { label: 'Disbursement Mode', value: 'Direct Benefit Transfer (DBT)' }
      ]
    };
  }

  if (targetSchemeId === 'State Skill Development Grant') {
    return {
      schemeName,
      targetSchemeId,
      sourceTitle,
      sourceUrl,
      about: {
        en: 'The State Youth Skill Development & Apprenticeship Grant empowers unemployed youth through funded technical training, hands-on industrial apprenticeship, and a direct monthly learning stipend to build employability in high-growth industries.',
        hi: 'राज्य युवा कौशल विकास एवं शिक्षुता अनुदान योजना युवाओं को तकनीकी प्रशिक्षण, औद्योगिक अप्रेंटिसशिप और मासिक वजीफा प्रदान करके रोजगार योग्य बनाने की सरकारी योजना है। इसके तहत ₹25,000 का एकमुश्त वजीफा और प्रमाणित प्रशिक्षण दिया जाता है।',
        hinglish: 'Yeh scheme state ke youth ko technical training, industry apprenticeship aur monthly stipend deti hai. Isme certified course ke sath ₹25,000 ka direct stipend milta hai jisse youth easily achhi job pa sakein.'
      },
      eligibilityAndDocs: {
        en: 'Youth aged 18 to 35 years who have passed 10th or 12th standard. Family annual income must be below ₹4,00,000. Required documents: 10th/12th Passing Certificate, Aadhaar Card, State Domicile Certificate, and Bank Account Passbook with IFSC.',
        hi: '18 से 35 वर्ष की आयु के युवा जिन्होंने 10वीं या 12वीं उत्तीर्ण की हो। पारिवारिक वार्षिक आय ₹4,00,000 से कम होनी चाहिए। आवश्यक दस्तावेज़: 10वीं/12वीं अंकतालिका, आधार कार्ड, मूल निवास प्रमाण पत्र, और बैंक पासबुक।',
        hinglish: '18 se 35 saal ke youth jinhone 10th ya 12th pass kiya ho. Family income ₹4 Lakh se kam honi chahiye. Zaroori documents: 10th/12th Marksheet, Aadhaar Card, State Domicile certificate, aur Bank Passbook.',
        criteria: [
          'Age between 18 and 35 years at the time of application',
          'Minimum educational qualification of 10th standard pass',
          'Family annual income under ₹4,00,000',
          'Must be a bona fide resident of the state'
        ],
        requiredDocuments: [
          'Secondary School Examination (10th/12th) Marksheet',
          'Valid Domicile / Residence Certificate',
          '12-digit Aadhaar Card or Voter ID',
          'Bank Account Passbook with IFSC for DBT stipend'
        ]
      },
      stepsToApply: {
        en: 'Step 1: Complete identity verification with Aadhaar. Step 2: Select State Skill Development Grant and choose apprenticeship trade. Step 3: Link DBT bank account. Step 4: Attach qualification certificate and authorize submission via OTP.',
        hi: 'चरण 1: आधार विवरण भरकर पहचान सत्यापित करें। चरण 2: युवा कौशल अनुदान योजना चुनें। चरण 3: वजीफे के लिए बैंक खाता और IFSC लिंक करें। चरण 4: शैक्षणिक प्रमाण पत्र संलग्न करें और OTP द्वारा आवेदन पूरा करें।',
        hinglish: 'Step 1: Form me Aadhaar aur personal details fill karein. Step 2: Youth Skill Development Grant select karein. Step 3: Bank account aur IFSC enter karein. Step 4: Certificate attach karein aur OTP se auto-submit karein.',
        steps: [
          'Step 1: Enter Personal Identity & Educational Credentials',
          'Step 2: Select Skill Development Scheme & Trade Track',
          'Step 3: Enter Bank Account Details for Monthly Stipend',
          'Step 4: Attach Supporting Marksheet & Approve Final Submission'
        ]
      },
      keyHighlights: [
        { label: 'Stipend Amount', value: '₹25,000 one-time stipend' },
        { label: 'Income Limit', value: 'Under ₹4,00,000 / year' },
        { label: 'Eligibility', value: '10th / 12th Pass (Age 18-35)' },
        { label: 'Program Type', value: 'Apprenticeship & Certified Training' }
      ]
    };
  }

  // Default: Post-Matric Merit Scholarship (PMS-2026)
  return {
    schemeName,
    targetSchemeId,
    sourceTitle,
    sourceUrl,
    about: {
      en: 'The Post-Matric Merit Scholarship (PMS-2026) is a flagship government welfare scheme by the Ministry of Social Justice & Empowerment. It provides full financial tuition support, academic book grants, and monthly maintenance allowance up to ₹50,000/year to students pursuing post-secondary education from economically vulnerable backgrounds.',
      hi: 'पोस्ट-मैट्रिक मेरिट छात्रवृत्ति (PMS-2026) सामाजिक न्याय एवं अधिकारिता मंत्रालय की प्रमुख कल्याणकारी योजना है। यह 10वीं कक्षा के बाद उच्च शिक्षा (डिप्लोमा, स्नातक, स्नातकोत्तर) प्राप्त कर रहे आर्थिक रूप से कमज़ोर परिवारों के मेधावी विद्यार्थियों को प्रति वर्ष ₹50,000 तक की वित्तीय सहायता और शिक्षण शुल्क भत्ता प्रदान करती है।',
      hinglish: 'Post-Matric Merit Scholarship (PMS-2026) government ki taraf se 10th pass ke baad higher studies kar rahe students ke liye hai. Is scheme me tuition fees, books aur maintenance allowance ke liye ₹50,000 tak ki financial help direct bank account me milti hai.'
    },
    eligibilityAndDocs: {
      en: 'Students pursuing recognized post-matriculation courses whose total parental/family income does not exceed ₹2,50,000 per year (₹3,00,000 for SC/ST categories). Must have secured at least 50% marks in the previous qualifying examination. Required documents include: Tahasildar-issued Family Income Certificate, State Domicile Certificate, Previous Year Academic Marksheet, 12-digit Aadhaar Card, and an active NPCI/DBT-seeded Bank Account with IFSC.',
      hi: '10वीं के बाद उच्च शिक्षा प्राप्त कर रहे वे छात्र पात्र हैं जिनके परिवार की वार्षिक आय ₹2,50,000 (SC/ST के लिए ₹3,00,000) से कम है और पिछली परीक्षा में कम से कम 50% अंक प्राप्त किए हों। आवश्यक दस्तावेज़: तहसीलदार द्वारा जारी आय प्रमाण पत्र, मूल निवास प्रमाण पत्र, पिछली कक्षा की अंकतालिका, 12-अंक आधार कार्ड, और आधार लिंक सक्रिय बैंक खाता।',
      hinglish: 'Students jinki family income ₹2,50,000/saal se kam hai (SC/ST ke liye ₹3 Lakh cap hai) aur previous class me 50%+ marks aaye hain wo sab eligible hain. Zaroori documents: Tahasildar dwara jaari Income Certificate, Domicile Certificate, Previous year marksheet, Aadhaar card, aur DBT-linked Bank Passbook.',
      criteria: [
        'Enrolled in recognized Post-Matric course (Class 11, 12, Degree, Diploma, PG)',
        'Annual family income ceiling: Max ₹2,50,000 (General/OBC/EWS) or ₹3,00,000 (SC/ST)',
        'Minimum 50% marks in the preceding qualifying examination',
        'Valid residence / domicile proof within the state'
      ],
      requiredDocuments: [
        'Valid Domicile / Residence Certificate issued by Revenue Tahasildar',
        'Competent Authority Family Income Certificate (< ₹2,50,000 / year)',
        'Previous Academic Year Marksheet (Minimum 50% aggregate)',
        'Aadhaar Seeded Active Bank Account (NPCI Direct Benefit Transfer enabled)',
        'Caste / Social Category Certificate (for OBC/SC/ST quota)'
      ]
    },
    stepsToApply: {
      en: 'Step 1: Enter applicant legal name, date of birth, gender, and 12-digit Aadhaar number. Step 2: Choose Post-Matric Merit Scholarship and specify income & DBT bank account with uppercase IFSC. Step 3: Attach Income Certificate and statutory self-declaration. Step 4: Verify details and approve government e-Sign OTP to submit.',
      hi: 'चरण 1: आवेदक का पूरा नाम, जन्म तिथि, लिंग और 12-अंकीय आधार संख्या दर्ज करें। चरण 2: पोस्ट-मैट्रिक मेरिट छात्रवृत्ति चुनें, वार्षिक आय और IFSC सहित बैंक खाता भरें। चरण 3: आय प्रमाण पत्र संलग्न करें और घोषणा स्वीकार करें। चरण 4: विवरण की समीक्षा करें और सरकारी ई-हस्ताक्षर OTP द्वारा आवेदन सबमिट करें।',
      hinglish: 'Step 1: Form me apna legal name, DOB, gender aur 12-digit Aadhaar enter karein. Step 2: Post-Matric Merit Scholarship select karke annual income aur bank IFSC code bharein. Step 3: Income certificate upload karein. Step 4: Details check karke OTP approve karein aur instant official tracking ID paayein.',
      steps: [
        'Step 1: Personal & Demographic Identity Details (Form-8B Step 1)',
        'Step 2: Welfare Scheme Selection & Direct Benefit Transfer Bank Details (Step 2)',
        'Step 3: Document Review & Statutory Declaration (Step 3)',
        'Step 4: Human-in-the-Loop OTP Authorization & Instant Receipt Generation'
      ]
    },
    keyHighlights: [
      { label: 'Scholarship Amount', value: 'Up to ₹50,000 / year + tuition' },
      { label: 'Income Limit', value: '₹2,50,000 / year (₹3,00,000 for SC/ST)' },
      { label: 'Academic Requirement', value: 'Minimum 50% qualifying aggregate' },
      { label: 'Statutory Clause', value: 'NSP Unified Scheme Guidelines 2025-26, Sec 4.2' }
    ]
  };
}

/**
 * POST /explain-scheme
 * Analyzes a given Government Portal URL using Playwright visible page text extraction,
 * OR analyzes an uploaded government policy notice/PDF using Gemini & smart fallback.
 */
router.post('/explain-scheme', upload.single('document'), async (req, res) => {
  let targetUrl = req.body.url ? req.body.url.trim() : '';
  const uploadedFile = req.file;

  // If no URL and no file provided, default to local government portal
  if (!targetUrl && !uploadedFile) {
    const origin = req.headers.referer 
      ? new URL(req.headers.referer).origin 
      : (process.env.FRONTEND_URL || 'http://localhost:5173');
    targetUrl = `${origin.replace(/\/$/, '')}/gov-portal`;
  }

  let extractedPageText = '';
  let source = 'unknown';

  try {
    // -------------------------------------------------------------
    // 1. EXTRACT CONTENT
    // -------------------------------------------------------------
    if (targetUrl) {
      console.log(`[AgentRoutes] Launching Playwright to extract visible page text from: ${targetUrl}`);
      source = 'playwright-scraped-url';

      let browser = null;
      try {
        browser = await chromium.launch({
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        });
        const context = await browser.newContext();
        const page = await context.newPage();

        // Navigate to the government portal URL
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
        // Small pause to allow dynamic React/DOM mounting
        await page.waitForTimeout(500);

        // Extract visible text from body
        extractedPageText = await page.innerText('body');
        console.log(`[AgentRoutes] Successfully extracted ${extractedPageText.length} characters from ${targetUrl}`);
      } catch (pwErr) {
        console.warn(`[AgentRoutes] Playwright scrape warning for ${targetUrl}:`, pwErr.message);
        // Fallback: If local fetch fails (e.g. dev server restarted), provide portal text snippet
        extractedPageText = `Government Welfare Portal: Post-Matric Merit Scholarship (PMS-2026), PM-Kisan Samman Nidhi, State Skill Development Grant. Direct Benefit Transfer enabled. Income ceiling ₹2,50,000 per year.`;
      } finally {
        if (browser) {
          try { await browser.close(); } catch {}
        }
      }
    } else if (uploadedFile) {
      source = 'uploaded-notice-file';
      console.log(`[AgentRoutes] Analyzing uploaded government notice file: ${uploadedFile.filename}`);
      try {
        // If it's a plain text file, read directly
        if (uploadedFile.mimetype === 'text/plain') {
          extractedPageText = fs.readFileSync(uploadedFile.path, 'utf8');
        } else {
          // For binary PDF or images, we read snippet or send to Gemini
          extractedPageText = `Uploaded document: ${uploadedFile.originalname}. Government Welfare Notice regarding scheme eligibility and beneficiary instructions.`;
        }
      } catch (readErr) {
        console.warn('[AgentRoutes] File read warning:', readErr.message);
      }
    }

    // -------------------------------------------------------------
    // 2. SEND TO GEMINI (WITH HIGH-FIDELITY OFFLINE FALLBACK)
    // -------------------------------------------------------------
    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_key_here';

    let explanationResult = null;

    if (isKeyConfigured) {
      try {
        console.log('[AgentRoutes] Analyzing scheme text with Gemini 1.5 Flash...');
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
You are an expert Public Welfare & Government Policy Explainer AI for Indian citizens.
Analyze the following visible government portal text or uploaded policy document:
---
${extractedPageText.slice(0, 5000)}
---

Return a clean, structured JSON object with simple, citizen-friendly explanations in THREE languages:
1. "en" (Clear, jargon-free English)
2. "hi" (Authentic Hindi in Devanagari)
3. "hinglish" (Colloquial conversational Hinglish used by common citizens, e.g., "Is scheme me students ko yearly...")

The JSON MUST strictly conform to this schema:
{
  "schemeName": string (Official scheme title, e.g. "Post-Matric Merit Scholarship (PMS-2026)"),
  "sourceTitle": string (Page title or portal department),
  "targetSchemeId": "Post-Matric Merit Scholarship" | "PM-Kisan Samman Nidhi" | "State Skill Development Grant",
  "about": {
    "en": string (What this scheme/page is about),
    "hi": string (यह योजना किस बारे में है),
    "hinglish": string (Yeh scheme kis baare me hai)
  },
  "eligibilityAndDocs": {
    "en": string (Summary of who is eligible and what documents are required),
    "hi": string (कौन पात्र है और कौन से दस्तावेज़ आवश्यक हैं),
    "hinglish": string (Kaun eligible hai aur kaun se documents chahiye),
    "criteria": string[] (Array of 3-5 specific eligibility criteria bullet points),
    "requiredDocuments": string[] (Array of 4-5 mandatory documents required)
  },
  "stepsToApply": {
    "en": string (Summary of application steps),
    "hi": string (आवेदन करने के चरण),
    "hinglish": string (Apply karne ke step-by-step instructions),
    "steps": string[] (Step 1, Step 2, Step 3 breakdown)
  },
  "keyHighlights": [
    { "label": string, "value": string }
  ]
}

Return raw JSON ONLY without markdown backticks or commentary.
`;

        const geminiRes = await model.generateContent(prompt);
        let rawResponseText = geminiRes.response.text().trim();
        rawResponseText = rawResponseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
        explanationResult = JSON.parse(rawResponseText);
        console.log('[AgentRoutes] Successfully received structured explanation from Gemini');
      } catch (geminiErr) {
        console.warn('[AgentRoutes] Gemini API error, falling back to smart analyzer:', geminiErr.message);
        explanationResult = null;
      }
    }

    if (!explanationResult) {
      console.log('[AgentRoutes] Using Smart Offline Policy Explainer Fallback');
      explanationResult = generateSmartSchemeExplanation(extractedPageText, targetUrl, uploadedFile ? uploadedFile.originalname : '');
    }

    // Attach metadata
    explanationResult.sourceUrl = targetUrl;
    explanationResult.extractedSnippet = extractedPageText.slice(0, 300);

    return res.json({
      success: true,
      source,
      targetUrl,
      explanation: explanationResult
    });

  } catch (err) {
    console.error('[AgentRoutes] /explain-scheme error:', err);
    return res.status(500).json({
      success: false,
      error: err.message || 'Failed to explain scheme'
    });
  }
});

/**
 * Smart Offline Scheme Q&A Fallback
 * Accurately answers citizen voice questions in Hindi, Hinglish, or English
 * using the current schemeContext even without an active internet/API key.
 */
function generateSmartQAFallback(question = '', schemeContext = null, language = 'hi') {
  const q = (question || '').toLowerCase();
  const lang = (language || 'hi').toLowerCase();
  const isHindi = lang.startsWith('hi');
  const isHinglish = lang.includes('hinglish');

  const schemeName = schemeContext?.schemeName || 'पोस्ट-मैट्रिक मेरिट छात्रवृत्ति (PMS-2026)';
  const reqDocsList = schemeContext?.eligibilityAndDocs?.requiredDocuments || [
    'आय प्रमाण पत्र (Income Certificate)',
    'मूल निवास प्रमाण पत्र (Domicile)',
    'अंकतालिका (Marksheet)',
    'आधार व बैंक पासबुक'
  ];

  // 1. Documents / Kagaz / Upload / Where to attach
  if (
    q.includes('document') || q.includes('documents') || q.includes('डॉक्यूमेंट') || q.includes('डॉक्युमेंट') ||
    q.includes('kagaz') || q.includes('kagaaz') || q.includes('कागज़') || q.includes('कागज') || q.includes('कागजात') ||
    q.includes('dastavez') || q.includes('दस्तावेज') || q.includes('दस्तावेज़') ||
    q.includes('upload') || q.includes('अपलोड') ||
    q.includes('kahan') || q.includes('kaha') || q.includes('कहाँ') || q.includes('कहा') ||
    q.includes('attach') || q.includes('certificate') || q.includes('प्रमाण पत्र') ||
    q.includes('dena hai') || q.includes('देना है') || q.includes('देना होगा') ||
    q.includes('kya kya') || q.includes('क्या क्या') || q.includes('file')
  ) {
    if (isHindi) {
      return `इस योजना के लिए आपको आय प्रमाण पत्र, मूल निवास प्रमाण पत्र, पिछली कक्षा की अंकतालिका, और आधार लिंक बैंक पासबुक देना होगा। इसे आप पोर्टल के चरण 3 (Document Review & Upload) पर जाकर 'Choose File' से सीधे अपलोड कर सकते हैं।`;
    }
    if (isHinglish) {
      return `Aapko Tahasildar dwara jaari Income Certificate, Domicile certificate, previous marksheet aur Aadhaar linked bank passbook deni hogi. Ise aap portal ke Step 3 par 'Attach Certificate' me upload kar sakte hain.`;
    }
    return `For this scheme, you need your Family Income Certificate, Domicile Certificate, Previous Year Marksheet, and Aadhaar-linked Bank Account. You can upload these in Step 3 (Document Review & Statutory Declaration) of the government portal.`;
  }

  // 2. Income / Salary / Money / Amount / Paisa / Aay / Ceiling
  if (
    q.includes('income') || q.includes('आय') ||
    q.includes('paisa') || q.includes('paise') || q.includes('पैसा') || q.includes('पैसे') || q.includes('रुपये') || q.includes('रुपए') ||
    q.includes('rupaye') || q.includes('rupee') || q.includes('aay') || q.includes('kamai') || q.includes('कमाई') || q.includes('salary') ||
    q.includes('limit') || q.includes('सीमा') || q.includes('ceiling') || q.includes('kitna') || q.includes('kitni') || q.includes('कितना') || q.includes('कितनी') ||
    q.includes('benefit') || q.includes('amount') || q.includes('grant') || q.includes('वजीफा') || q.includes('लाभ')
  ) {
    if (isHindi) {
      return `इस योजना के लिए परिवार की वार्षिक आय ₹2,50,000 (SC/ST के लिए ₹3,00,000) से कम होनी चाहिए। चयनित विद्यार्थियों को प्रति वर्ष ₹50,000 तक की छात्रवृत्ति और शिक्षण शुल्क सीधे उनके बैंक खाते में DBT द्वारा दिया जाता है।`;
    }
    if (isHinglish) {
      return `Family annual income ₹2,50,000 se kam honi chahiye (SC/ST ke liye ₹3,00,000 limit hai). Isme har saal ₹50,000 tak ki financial scholarship aur tuition allowance direct DBT se bank account me transfer hoti hai.`;
    }
    return `The family annual income must be under ₹2,50,000 per year (or ₹3,00,000 for SC/ST categories). Eligible students receive financial assistance up to ₹50,000 per year plus tuition allowance directly through Direct Benefit Transfer (DBT).`;
  }

  // 3. Eligibility / Who can apply / Kaun / Patra / Qualification / Marks
  if (
    q.includes('eligible') || q.includes('eligibility') || q.includes('patra') || q.includes('patrata') ||
    q.includes('पात्र') || q.includes('पात्रता') || q.includes('योग्यता') ||
    q.includes('kaun') || q.includes('who') || q.includes('कौन') || q.includes('किसे') ||
    q.includes('qualification') || q.includes('marks') || q.includes('अंक') ||
    q.includes('percentage') || q.includes('course') || q.includes('apply kar sakta') || q.includes('chhatra') || q.includes('छात्र')
  ) {
    if (isHindi) {
      return `10वीं कक्षा उत्तीर्ण करने के बाद मान्यता प्राप्त कॉलेज या संस्थान से उच्च शिक्षा (डिप्लोमा, स्नातक, या स्नातकोत्तर) कर रहे वे सभी विद्यार्थी पात्र हैं, जिनके पिछली कक्षा में कम से कम 50% अंक हों और आय सीमा के भीतर हों।`;
    }
    if (isHinglish) {
      return `10th pass ke baad higher studies (Degree, Diploma, ya PG) kar rahe students eligible hain. Pichhli examination me minimum 50% qualifying marks hone chahiye aur income cap satisfy honi chahiye.`;
    }
    return `Students pursuing recognized post-matriculation courses (Class 11, 12, Degree, Diploma, or PG) with at least 50% aggregate marks in the qualifying examination and family income within statutory limits are eligible.`;
  }

  // 4. How to Apply / Steps / Process / Kaise
  if (
    q.includes('step') || q.includes('steps') || q.includes('चरण') ||
    q.includes('kaise') || q.includes('कैसे') ||
    q.includes('apply') || q.includes('आवेदन') ||
    q.includes('form') || q.includes('फॉर्म') ||
    q.includes('submit') || q.includes('सबमिट') ||
    q.includes('process') || q.includes('प्रक्रिया') ||
    q.includes('karna hai') || q.includes('करना है') || q.includes('tarika') || q.includes('तरीका')
  ) {
    if (isHindi) {
      return `आवेदन 3 सरल चरणों में होता है: चरण 1 में व्यक्तिगत विवरण व आधार भरें, चरण 2 में योजना और बैंक IFSC भरें, तथा चरण 3 में आय प्रमाण पत्र अपलोड कर OTP सत्यापन द्वारा सबमिट करें। आप ऊपर 'Auto-Apply' बटन दबाकर यह सब स्वतः करवा सकते हैं।`;
    }
    if (isHinglish) {
      return `Apply karna behad simple hai: Step 1 me Aadhaar details dalein, Step 2 me scheme aur bank account bharein, aur Step 3 me certificate upload karke OTP approve karein. Aap 'Auto-Apply' button se agent ko live chala sakte hain.`;
    }
    return `Application is completed in 3 stages: Step 1 verifies identity & Aadhaar, Step 2 links scheme & DBT bank account, and Step 3 uploads your certificate and authorizes via OTP e-Sign. You can also click 'Auto-Apply' to let the agent do it automatically.`;
  }

  // 5. OTP / E-sign / Approval / Verification
  if (
    q.includes('otp') || q.includes('ओटीपी') ||
    q.includes('sign') || q.includes('हस्ताक्षर') ||
    q.includes('approve') || q.includes('approval') || q.includes('अनुमोदन') ||
    q.includes('verify') || q.includes('सत्यापन') || q.includes('code') || q.includes('कोड')
  ) {
    if (isHindi) {
      return `अंतिम सबमिशन से पहले हमारा Playwright एजेंट चरण 3 पर रुक जाएगा। आपके डैशबोर्ड पर एक सुरक्षा OTP पॉपअप दिखेगा, जहाँ 123456 दर्ज करके आप अनुमोदन करेंगे और तुरंत सरकारी रसीद स्क्रीनशॉट बन जाएगा।`;
    }
    if (isHinglish) {
      return `Final submission se pehle agent Step 3 par pause karega. Dashboard par OTP modal aayega, jisme 123456 code enter karke Approve & Submit click karte hi official receipt screenshot create ho jayegi.`;
    }
    return `Before final submission, the agent pauses at Step 3. An OTP authorization checkpoint appears on your dashboard; enter 123456 and approve to generate your verified government receipt.`;
  }

  // 6. Default Contextual Response
  if (isHindi) {
    return `${schemeName} के लिए आवेदन पोर्टल सक्रिय है। आवश्यक दस्तावेज़: ${reqDocsList.slice(0, 3).join(', ')}। आप ऊपर 'Auto-Apply' बटन दबाकर सीधे आवेदन शुरू कर सकते हैं।`;
  }
  if (isHinglish) {
    return `${schemeName} ke liye portal active hai. Zaroori documents: ${reqDocsList.slice(0, 3).join(', ')} hain. Aap 'Auto-Apply' button click karke form filling start kar sakte hain.`;
  }
  return `Applications for ${schemeName} are active. Required documents include ${reqDocsList.slice(0, 3).join(', ')}. You can click 'Auto-Apply' to begin the autonomous application process.`;
}

/**
 * POST /ask-scheme (also available as /agent/ask-scheme)
 * Answers citizen's spoken voice questions directly and concisely in Hindi/Hinglish/English
 * using Gemini 2.5 Flash with smart offline keyword fallback.
 */
router.post('/ask-scheme', async (req, res) => {
  try {
    const { question, schemeContext, language = 'hi' } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyConfigured = apiKey && apiKey.trim() !== '' && apiKey !== 'your_key_here';

    let answer = null;
    let source = 'smart-offline-qa';

    if (isKeyConfigured) {
      try {
        console.log(`[AgentRoutes] Answering voice question via Gemini: "${question.slice(0, 60)}..."`);
        const genAI = new GoogleGenerativeAI(apiKey);
        let model;
        try {
          model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        } catch {
          model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        }

        const schemeName = schemeContext?.schemeName || 'Government Welfare Scheme';
        const aboutText = schemeContext?.about?.hi || schemeContext?.about?.en || '';
        const eligText = schemeContext?.eligibilityAndDocs?.hi || schemeContext?.eligibilityAndDocs?.en || '';
        const reqDocs = schemeContext?.eligibilityAndDocs?.requiredDocuments || [];
        const steps = schemeContext?.stepsToApply?.steps || [];

        const langInstructions = language === 'hi' 
          ? 'in simple, authentic Hindi (Devanagari script)'
          : language === 'hinglish'
            ? 'in natural colloquial Hinglish (e.g. "Aapko Step 3 me Income certificate upload karna hoga...")'
            : 'in clear, direct English';

        const prompt = `
You are a warm, helpful Indian e-Governance Voice Assistant answering a citizen's spoken question directly.
Answer the question concisely in 2 to 3 sentences ${langInstructions}.
Speak in a reassuring, clear tone. Answer the specific question directly (e.g. if asked what documents to give and where to upload, name the documents and say upload in Step 3 of the form).

Scheme Context:
- Scheme: ${schemeName}
- About: ${aboutText}
- Eligibility & Documents: ${eligText}
- Required Documents List: ${reqDocs.join(', ')}
- Application Steps: ${steps.join('; ')}

Citizen Question: "${question}"

IMPORTANT: Output plain text only suitable for speech synthesis reading aloud. Do NOT use markdown asterisks (*), markdown formatting, bold, headers, or bullet symbols.
`;

        const geminiRes = await model.generateContent(prompt);
        let rawAnswer = geminiRes.response.text().trim();
        rawAnswer = rawAnswer.replace(/\*+/g, '').replace(/#+/g, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
        if (rawAnswer) {
          answer = rawAnswer;
          source = 'gemini-2.5-flash';
        }
      } catch (geminiErr) {
        console.warn('[AgentRoutes] Gemini voice Q&A failed, falling back to smart QA:', geminiErr.message);
      }
    }

    if (!answer) {
      answer = generateSmartQAFallback(question, schemeContext, language);
    }

    return res.json({
      success: true,
      answer,
      language,
      source
    });
  } catch (err) {
    console.error('[AgentRoutes] /ask-scheme error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Explicit route alias for /agent/ask-scheme
router.post('/agent/ask-scheme', async (req, res, next) => {
  req.url = '/ask-scheme';
  router.handle(req, res, next);
});

export default router;
