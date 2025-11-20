// App.jsx - Updated with AI Analysis
import React, { useState } from 'react';
import WellnessFormWithWalrus from './components/WellnessFormWithWalrus';
import AIAnalysisComponent from './components/AIAnalysisComponent';
import './App.css';

function App() {
  const [entries, setEntries] = useState([]);
  const [walrusIds, setWalrusIds] = useState({});
  const [activeTab, setActiveTab] = useState('form'); // 'form' or 'analysis'

  const handleFormSubmit = (formData) => {
    // This will be handled by WellnessFormWithWalrus component
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>🌟 Wellness Journal</h1>
          <p>Decentralized Health Data Storage & AI-Powered Insights on Blockchain</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          📝 Journal Entry
        </button>
        <button
          className={`nav-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          🤖 AI Analysis
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'form' && (
          <WellnessFormWithWalrus />
        )}

        {activeTab === 'analysis' && (
          <AIAnalysisComponent entries={entries} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>Powered by Walrus Decentralized Storage & Sui Blockchain 🚀</p>
          <p className="footer-tech">
            Tech Stack: React + Move + Walrus + Seal + AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
