// App.jsx
import React, { useState } from 'react';
import WellnessFormWithWalrus from './components/WellnessFormWithWalrus';
import AIAnalysisComponent from './components/AIAnalysisComponent';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('form');
  const [entries, setEntries] = useState([]);

  // Handle form submission - receives entry from WellnessFormWithWalrus
  const handleFormSubmit = (newEntry) => {
    setEntries([newEntry, ...entries]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌟 Wellness Journal</h1>
        <p>Track your daily health & wellness on the blockchain</p>
        <p className="walrus-badge">Powered by Walrus & Sui Blockchain 🚀</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="app-navigation">
        <button
          className={`nav-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
        >
          📝 New Entry
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
          <WellnessFormWithWalrus 
            onSubmit={handleFormSubmit}
            entries={entries}
          />
        )}
        
        {activeTab === 'analysis' && (
          <AIAnalysisComponent entries={entries} />
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Walrus & Sui Blockchain 🚀</p>
      </footer>
    </div>
  );
}

export default App;
