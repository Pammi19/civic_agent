import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import MockGovPortal from './pages/MockGovPortal';
import CitizenDashboard from './pages/CitizenDashboard';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Navigation Quick Bar for Hackathon Demo / Presentation */}
        <nav className="bg-slate-900 border-b border-slate-800 text-white text-xs px-4 py-2 flex items-center justify-between z-50">
          <div className="flex items-center space-x-3">
            <span className="font-extrabold tracking-wide bg-gradient-to-r from-orange-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">
              CIVICPULSE AI
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Autonomous Public Service & Bureaucracy Execution Agent</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="text-slate-300 hover:text-white px-2.5 py-1 rounded hover:bg-slate-800 transition font-medium"
            >
              Citizen Command Dashboard (/)
            </Link>
            <Link 
              to="/gov-portal" 
              className="bg-gov-blue/80 text-blue-200 hover:bg-gov-blue hover:text-white px-2.5 py-1 rounded transition font-medium border border-blue-500/30"
            >
              Mock Gov Portal (/gov-portal)
            </Link>
          </div>
        </nav>

        {/* Route views */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<CitizenDashboard />} />
            <Route path="/gov-portal" element={<MockGovPortal />} />
            <Route path="*" element={<CitizenDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
