---
title: Build Autonomous Public Service & Bureaucracy Execution Agent (MERN + Playwright)
description: End-to-end build workflow for Track 1, Problem 3 — an AI agent that extracts citizen details from documents/voice, verifies welfare scheme eligibility, and autonomously fills government portals with Human-in-the-Loop OTP approval.
---

# Project Architecture & Rules

- **Stack**: MongoDB (or local JSON/SQLite fallback if MongoDB daemon isn't running), Express.js, React (Vite + Tailwind CSS), Node.js, and `playwright` (Node.js SDK).
- **LLM Integration**: Use `@google/genai` (Gemini API) or OpenAI SDK via environment variables (`GEMINI_API_KEY`) for multimodal document extraction and multilingual intent parsing.
- **Demo Reliability Rule**: Never automate external live `.gov` websites during demos. Build a dedicated, realistic **Mock Government Scholarship & Subsidy Portal** inside the React app (`/gov-portal`) so live Playwright demonstrations run reliably without network or CAPTCHA failures.
- **Live Visual Execution Rule**: Configure Playwright with `headless: false` and `slowMo: 250` so judges can visibly watch the AI agent type, select dropdowns, and upload files in real time.

---

# Phase 1: Workspace Initialization & Monorepo Setup

1. Initialize the project structure with two main directories: `client/` (React + Vite + Tailwind CSS + Lucide Icons) and `server/` (Node.js + Express + Playwright).
2. Create a `.env.example` in `server/` containing `PORT=5000`, `MONGO_URI=mongodb://localhost:27017/civic_agent`, and `GEMINI_API_KEY=your_key_here`.
3. Install all dependencies in both `client/` and `server/`, including `playwright` and Chromium binaries (`npx playwright install chromium`).
   // turbo
4. Verify that both `client` and `server` compile cleanly without missing dependencies.

---

# Phase 2: Realistic Mock Government Portal (`client/src/pages/MockGovPortal.jsx`)

1. Build a multi-step government service portal styled like an official Indian e-Governance portal ("National Citizen Welfare & Scholarship Portal - eSeva").
2. Include **3 distinct steps** with realistic validation rules:
   - **Step 1 (Personal & Identity Details)**: Full Name, Date of Birth, Gender, Aadhaar/ID Number (12-digit validation), Mobile Number, and State/District cascading dropdowns.
   - **Step 2 (Scheme & Income Details)**: Scheme Selection (`Post-Matric Merit Scholarship`, `PM-Kisan Samman Nidhi`, `State Skill Development Grant`), Annual Family Income (numeric validation), Category (`General`, `OBC`, `SC`, `ST`), and Bank Account + IFSC Code.
   - **Step 3 (Document Upload & Final Review)**: File input accepting `.pdf`, `.jpg`, or `.png` for Income/ID Certificate, a preview summary box, and a `Final Submit` button (`id="final-submit-btn"`).
3. Upon clicking `Final Submit`, generate a unique **Application Tracking ID** (e.g., `GOV-2026-84920`), timestamp, and downloadable **Official Acknowledgment Receipt** view.
4. Ensure every input field has clear `id`, `name`, and `aria-label` attributes so the Playwright agent can reliably locate and interact with them.

---

# Phase 3: Multimodal AI Extractor & Scheme Eligibility Engine (`server/services/`)

1. Create `server/services/aiExtractor.js`:
   - Accept an uploaded document image/PDF (ID card, Income Certificate, or Marksheet) and optional user voice/text prompt (supporting Hindi, Hinglish, and English).
   - Use a multimodal LLM to extract structured JSON matching the exact schema required by `/gov-portal` (`fullName`, `dob`, `gender`, `idNumber`, `mobile`, `state`, `district`, `schemeName`, `annualIncome`, `category`, `bankAccount`, `ifsc`).
   - Include a **Smart Mock Fallback Mode** if no API key is configured, so the project can still be tested and demonstrated offline.
2. Create `server/services/schemeChecker.js`:
   - Evaluate extracted user data against built-in eligibility rules (e.g., Income < ₹2,50,000 for Post-Matric Scholarship) and return a plain-language eligibility explanation in both English and Hindi.

---

# Phase 4: Autonomous Playwright Execution Worker (`server/services/playwrightAgent.js`)

1. Build an asynchronous Playwright automation service that accepts the validated citizen JSON and uploaded document file path.
2. Launch a visible Chromium window (`headless: false, slowMo: 250`) and navigate to `http://localhost:5173/gov-portal`.
3. Programmatically fill Step 1, handle cascading State/District dropdown delays, fill Step 2, and upload the citizen's certificate file in Step 3.
4. **Human-in-the-Loop Security Checkpoint**:
   - Pause execution right before clicking `#final-submit-btn`.
   - Emit a status event (`WAITING_FOR_OTP_APPROVAL`) to the frontend via Server-Sent Events (SSE) or WebSockets.
   - Wait until the user clicks **"Approve & Submit"** in the Citizen Dashboard before clicking `#final-submit-btn`.
5. Capture a full-page screenshot of the generated confirmation receipt, extract the Tracking ID from the DOM, save the record to the database/JSON store, and close the browser cleanly.

---

# Phase 5: Citizen Command Dashboard (`client/src/pages/CitizenDashboard.jsx`)

1. Design a modern, accessible citizen interface featuring:
   - **Multilingual Voice & Text Assistant**: Browser Web Speech API microphone button (supports `hi-IN` and `en-IN`) + text input so citizens can say _"Mera scholarship form bhar do"_ or _"Apply for my student grant"_.
   - **Document Dropzone**: Upload an ID or Income Certificate + a one-click **"Load Sample Student Certificate"** button for rapid hackathon demos.
   - **Live Agent Execution Timeline**: Real-time step-by-step progress log (`1. Document Parsed` $\rightarrow$ `2. Eligibility Verified` $\rightarrow$ `3. Browser Launched & Filling Form` $\rightarrow$ `4. Awaiting Citizen OTP Approval` $\rightarrow$ `5. Receipt Generated`).
   - **Human-in-the-Loop Approval Modal**: Pops up when Playwright pauses at Step 3, showing extracted values and an OTP confirmation button.
   - **Receipts & Audit Vault**: Displays completed applications, tracking numbers, and saved confirmation screenshots.

---

# Phase 6: End-to-End Verification & Demo Polish

1. Start both the Express backend and Vite frontend servers.
2. Run an automated end-to-end test using the sample certificate to verify that Playwright opens Chromium, fills all 3 steps of `/gov-portal`, pauses for approval, completes submission, and saves the receipt screenshot.
3. Fix any selector mismatches, timing issues, or console errors.
4. Generate a clean `README.md` with setup instructions and a 3-minute hackathon pitch & demo script.
