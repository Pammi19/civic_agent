import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

// Ensure db.json exists with initial schema
if (!fs.existsSync(DB_FILE)) {
  const initialData = {
    applications: [],
    sessions: [],
    logs: []
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

let isMongoConnected = false;

// Optional Mongoose Schema for MongoDB mode
const ApplicationSchema = new mongoose.Schema({
  trackingId: { type: String, unique: true, required: true },
  fullName: String,
  dob: String,
  gender: String,
  idNumber: String,
  mobile: String,
  state: String,
  district: String,
  schemeName: String,
  annualIncome: Number,
  category: String,
  bankAccount: String,
  ifsc: String,
  certificateFile: String,
  screenshotUrl: String,
  screenshotBase64: String,
  status: { type: String, default: 'SUBMITTED' },
  submittedAt: { type: Date, default: Date.now },
  eligibilityNotes: Object
}, { timestamps: true });

let ApplicationModel = null;

export async function initDatabase(mongoUri) {
  if (!mongoUri || mongoUri === 'none') {
    console.log('[Store] Using robust Local JSON Data Store (server/data/db.json)');
    return false;
  }

  try {
    mongoose.set('strictQuery', false);
    // 2-second connection timeout to avoid hanging if MongoDB is not installed locally
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    isMongoConnected = true;
    ApplicationModel = mongoose.model('Application', ApplicationSchema);
    console.log('[Store] Successfully connected to MongoDB database');
    return true;
  } catch (err) {
    console.warn(`[Store] MongoDB connection failed (${err.message}). Using local JSON fallback (server/data/db.json)`);
    isMongoConnected = false;
    return false;
  }
}

// Local JSON file helpers
function readLocalDb() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return { applications: [], sessions: [], logs: [] };
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[Store] Failed to write to local DB file:', err);
  }
}

export async function saveApplication(data) {
  if (isMongoConnected && ApplicationModel) {
    try {
      const doc = new ApplicationModel(data);
      return await doc.save();
    } catch (e) {
      console.warn('[Store] Mongo save failed, falling back to JSON file:', e.message);
    }
  }

  const db = readLocalDb();
  const existingIdx = db.applications.findIndex(a => a.trackingId === data.trackingId);
  const record = {
    ...data,
    updatedAt: new Date().toISOString()
  };
  if (!record.submittedAt) record.submittedAt = new Date().toISOString();

  if (existingIdx >= 0) {
    db.applications[existingIdx] = { ...db.applications[existingIdx], ...record };
  } else {
    db.applications.unshift(record);
  }
  writeLocalDb(db);
  return record;
}

export async function getApplication(trackingId) {
  if (isMongoConnected && ApplicationModel) {
    try {
      const doc = await ApplicationModel.findOne({ trackingId });
      if (doc) return doc.toObject();
    } catch (e) {
      console.warn('[Store] Mongo query error:', e.message);
    }
  }

  const db = readLocalDb();
  return db.applications.find(a => a.trackingId === trackingId) || null;
}

export async function listApplications() {
  if (isMongoConnected && ApplicationModel) {
    try {
      return await ApplicationModel.find().sort({ createdAt: -1 }).lean();
    } catch (e) {
      console.warn('[Store] Mongo list query error:', e.message);
    }
  }

  const db = readLocalDb();
  return db.applications || [];
}

// Agent sessions for tracking live execution & Human-in-the-Loop approvals
const activeSessions = new Map();

export function setSessionState(sessionId, stateData) {
  const current = activeSessions.get(sessionId) || {};
  const updated = { ...current, ...stateData, lastUpdated: Date.now() };
  activeSessions.set(sessionId, updated);

  const db = readLocalDb();
  const sIdx = db.sessions.findIndex(s => s.sessionId === sessionId);
  if (sIdx >= 0) {
    db.sessions[sIdx] = updated;
  } else {
    db.sessions.unshift(updated);
  }
  writeLocalDb(db);

  return updated;
}

export function getSessionState(sessionId) {
  return activeSessions.get(sessionId) || null;
}
