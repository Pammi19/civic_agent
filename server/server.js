import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/api.js';
import agentRouter from './routes/agentRoutes.js';
import { initDatabase } from './data/store.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_agent';

// Enable CORS for Vite frontend
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded receipts, certificates, and screenshots statically
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Mount CivicPulse API & Agent Routes
app.use('/api', apiRouter);
app.use('/api', agentRouter);
app.use('/api/agent', agentRouter);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'CivicPulse Bureaucracy Execution Agent API',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_key_here')
  });
});

// Optionally serve client build if running in unified production mode
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDist, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send('CivicPulse API is running. Start the Vite dev server on port 5173 for the frontend.');
    }
  });
});

async function startServer() {
  // Initialize Database with graceful local JSON fallback
  await initDatabase(MONGO_URI);

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`CivicPulse Execution Engine running on port ${PORT}`);
    console.log(`Backend API: http://localhost:${PORT}/api/health`);
    console.log(`Ready to orchestrate Autonomous Playwright Agents`);
    console.log(`=======================================================`);
  });
}

startServer();
