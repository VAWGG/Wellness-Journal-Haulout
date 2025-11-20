import React, { useState, useEffect } from 'react';
import {
  storeWellnessEntry,
  retrieveWellnessEntry,
  verifyEntryIntegrity
} from '../services/walrusService';
import './WellnessFormWithWalrus.css';

const WellnessFormWithWalrus = ({ onSubmit, entries: propEntries = [] }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mood: {
      current_mood: '',
      mood_score: 5,
      description: ''
    },
    health_metrics: {
      sleep: {
        hours: 0,
        quality: 5,
        notes: ''
      },
      exercise: {
        type: '',
        duration_minutes: 0,
        intensity: 'moderate',
        notes: ''
      },
      nutrition: {
        meals_logged: [],
        water_intake: 0,
        notes: ''
      },
      symptoms: {
        has_symptoms: false,
        symptom_list: [],
        severity: 0
      }
    },
    mental_health: {
      stress_level: 5,
      anxiety_level: 5,
      gratitude: '',
      challenges: ''
    },
    wellness_notes: ''
  });

  const [entries, setEntries] = useState(propEntries);
  const [showEntries, setShowEntries] = useState(false);
  
  // Sync with prop entries
  useEffect(() => {
    setEntries(propEntries);
  }, [propEntries]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Seal encryption settings
  const [useEncryption, setUseEncryption] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [walrusIdToRetrieve, setWalrusIdToRetrieve] = useState('');

  // Handle basic input change
  const handleInputChange = (e, path) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => {
      const keys = path.split('.');
      const updated = JSON.parse(JSON.stringify(prev));
      
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = newValue;
      
      return updated;
    });
  };

  // Handle slider change
  const handleSliderChange = (e, path) => {
    const value = parseInt(e.target.value);
    handleInputChange({ target: { value } }, path);
  };

  // Store entry on Walrus blockchain
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Prepare entry with metadata
      const entryToStore = {
        ...formData,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      // Validate encryption key if encryption is enabled
      if (useEncryption && !accessKey) {
        throw new Error('Access key is required when encryption is enabled');
      }

      // Store on Walrus
      const result = await storeWellnessEntry(
        entryToStore,
        useEncryption ? accessKey : null
      );

      // Add to local entries list
      const newEntry = {
        id: Date.now(),
        ...entryToStore,
        walrusId: result.walrusId,
        contentHash: result.contentHash,
        encrypted: result.encrypted,
        storedAt: result.timestamp,
        url: result.url
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      setSuccess(
        `✅ Entry stored on Walrus Testnet!\n` +
        `Walrus ID: ${result.walrusId}\n` +
        `Content Hash: ${result.contentHash.substring(0, 20)}...`
      );
      
      // Call parent onSubmit callback
      if (onSubmit) {
        onSubmit(newEntry);
      }
      
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mood: {
          current_mood: '',
          mood_score: 5,
          description: ''
        },
        health_metrics: {
          sleep: { hours: 0, quality: 5, notes: '' },
          exercise: { type: '', duration_minutes: 0, intensity: 'moderate', notes: '' },
          nutrition: { meals_logged: [], water_intake: 0, notes: '' },
          symptoms: { has_symptoms: false, symptom_list: [], severity: 0 }
        },
        mental_health: {
          stress_level: 5,
          anxiety_level: 5,
          gratitude: '',
          challenges: ''
        },
        wellness_notes: ''
      });

      console.log('✅ Entry stored on Walrus:', result);
    } catch (err) {
      setError(`Failed to store entry: ${err.message}`);
      console.error('Error storing entry:', err);
    } finally {
      setLoading(false);
    }
  };

  // Retrieve entry from Walrus
  const handleRetrieveEntry = async () => {
    if (!walrusIdToRetrieve) {
      setError('Please enter a Walrus ID');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const retrievedData = await retrieveWellnessEntry(
        walrusIdToRetrieve.trim(),
        useEncryption ? accessKey : null
      );

      // Verify integrity if hash is available
      if (retrievedData.contentHash) {
        const isValid = verifyEntryIntegrity(retrievedData, retrievedData.contentHash);
        if (!isValid) {
          setError('⚠️ Warning: Entry integrity verification failed!');
        } else {
          setSuccess('✅ Entry retrieved and verified successfully!');
        }
      } else {
        setSuccess('✅ Entry retrieved successfully!');
      }

      // Add to entries list
      const retrievedEntry = {
        id: Date.now(),
        ...retrievedData,
        walrusId: walrusIdToRetrieve,
        retrieved: true
      };

      setEntries([retrievedEntry, ...entries]);
      setWalrusIdToRetrieve('');
    } catch (err) {
      setError(`Failed to retrieve entry: ${err.message}`);
      console.error('Error retrieving entry:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-walrus-app">
      <header className="app-header">
        <h1>🌟 Wellness Journal</h1>
        <p>Track your daily health & wellness on the blockchain</p>
        <p className="walrus-badge">Powered by Walrus & Sui Blockchain 🚀</p>
      </header>

      <main className="app-main">
        {/* Encryption Settings */}
        <section className="walrus-settings-section">
          <h3>🔒 Security Settings</h3>
          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={useEncryption}
                onChange={(e) => setUseEncryption(e.target.checked)}
              />
              <span>Enable Seal Encryption</span>
            </label>
            {useEncryption && (
              <div className="form-group">
                <label>Access Key (for encryption/decryption):</label>
                <input
                  type="password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                  placeholder="Enter encryption key"
                  className="walrus-input"
                />
              </div>
            )}
          </div>
        </section>

        {/* Wellness Form - CREATE NEW ENTRY */}
        <form onSubmit={handleSubmit} className="wellness-form">
          <div className="form-header-section">
            <h2>📝 Create New Wellness Entry</h2>
            <p className="form-description">
              Fill out the form below and click "Store on Blockchain". A Walrus ID will be automatically generated and shown after successful storage.
            </p>
          </div>
          
          {/* Date */}
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange(e, 'date')}
              required
            />
          </div>

          {/* MOOD SECTION */}
          <section className="form-section">
            <h3>😊 Mood</h3>
            
            <div className="form-group">
              <label>Current Mood:</label>
              <input
                type="text"
                value={formData.mood.current_mood}
                onChange={(e) => handleInputChange(e, 'mood.current_mood')}
                placeholder="e.g., Happy, Anxious, Energetic"
              />
            </div>

            <div className="form-group">
              <label>Mood Score: {formData.mood.mood_score}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.mood.mood_score}
                onChange={(e) => handleSliderChange(e, 'mood.mood_score')}
                className="slider"
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={formData.mood.description}
                onChange={(e) => handleInputChange(e, 'mood.description')}
                placeholder="How are you feeling today?"
              />
            </div>
          </section>

          {/* HEALTH METRICS */}
          <section className="form-section">
            <h3>💤 Sleep</h3>
            
            <div className="form-group">
              <label>Hours of Sleep:</label>
              <input
                type="number"
                min="0"
                max="24"
                value={formData.health_metrics.sleep.hours}
                onChange={(e) => handleInputChange(e, 'health_metrics.sleep.hours')}
              />
            </div>

            <div className="form-group">
              <label>Sleep Quality: {formData.health_metrics.sleep.quality}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.health_metrics.sleep.quality}
                onChange={(e) => handleSliderChange(e, 'health_metrics.sleep.quality')}
                className="slider"
              />
            </div>
          </section>

          {/* MENTAL HEALTH */}
          <section className="form-section">
            <h3>🧠 Mental Health</h3>
            
            <div className="form-group">
              <label>Stress Level: {formData.mental_health.stress_level}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.mental_health.stress_level}
                onChange={(e) => handleSliderChange(e, 'mental_health.stress_level')}
                className="slider"
              />
            </div>

            <div className="form-group">
              <label>Anxiety Level: {formData.mental_health.anxiety_level}/10</label>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.mental_health.anxiety_level}
                onChange={(e) => handleSliderChange(e, 'mental_health.anxiety_level')}
                className="slider"
              />
            </div>

            <div className="form-group">
              <label>Gratitude:</label>
              <textarea
                value={formData.mental_health.gratitude}
                onChange={(e) => handleInputChange(e, 'mental_health.gratitude')}
                placeholder="What are you grateful for today?"
              />
            </div>
          </section>

          {/* Wellness Notes */}
          <div className="form-group">
            <label>Additional Notes:</label>
            <textarea
              value={formData.wellness_notes}
              onChange={(e) => handleInputChange(e, 'wellness_notes')}
              placeholder="Any other wellness notes..."
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '⏳ Storing on Blockchain...' : '💾 Store on Blockchain'}
            </button>
          </div>

          {/* Status Messages */}
          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
        </form>

        {/* Retrieve Entry Section - SEPARATE from Store */}
        <section className="retrieve-section">
          <h3>🔍 Retrieve Entry from Blockchain</h3>
          <p className="retrieve-description">
            Enter a Walrus ID to retrieve a previously stored entry. This is separate from creating new entries above.
          </p>
          <div className="retrieve-form">
            <input
              type="text"
              value={walrusIdToRetrieve}
              onChange={(e) => setWalrusIdToRetrieve(e.target.value)}
              placeholder="Enter Walrus ID (e.g., 0xabc123...)"
              className="walrus-input"
            />
            <button
              type="button"
              onClick={handleRetrieveEntry}
              className="btn-retrieve"
              disabled={loading || !walrusIdToRetrieve.trim()}
            >
              {loading ? 'Retrieving...' : '🔍 Retrieve Entry'}
            </button>
          </div>
          {entries.length > 0 && (
            <div className="quick-retrieve">
              <p className="quick-retrieve-label">Or select from your saved entries:</p>
              <div className="quick-retrieve-list">
                {entries.slice(0, 5).map((entry) => (
                  entry.walrusId && (
                    <button
                      key={entry.id}
                      type="button"
                      className="quick-retrieve-btn"
                      onClick={() => setWalrusIdToRetrieve(entry.walrusId)}
                    >
                      📋 {entry.date} - {entry.walrusId.substring(0, 12)}...
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Entries List */}
        {entries.length > 0 && (
          <div className="entries-section">
            <button 
              className="toggle-entries-btn"
              onClick={() => setShowEntries(!showEntries)}
            >
              {showEntries ? '▼' : '▶'} View Entries ({entries.length})
            </button>

            {showEntries && (
              <div className="entries-list">
                <h3>📋 Your Journal Entries</h3>
                {entries.map((entry) => (
                  <div key={entry.id} className="entry-card">
                    <div className="entry-header">
                      <strong>{entry.date}</strong>
                      <span className="entry-time">{entry.storedAt || entry.timestamp}</span>
                    </div>
                    {entry.walrusId && (
                      <div className="walrus-info">
                        <div className="walrus-id-section">
                          <strong>🌐 Walrus ID (Testnet):</strong> 
                          <code className="walrus-id" title={entry.walrusId}>{entry.walrusId}</code>
                          <button
                            className="copy-btn"
                            onClick={() => {
                              navigator.clipboard.writeText(entry.walrusId);
                              alert('Walrus ID copied to clipboard!');
                            }}
                            title="Copy Walrus ID"
                          >
                            📋 Copy
                          </button>
                        </div>
                        {entry.contentHash && (
                          <div className="walrus-hash-section">
                            <strong>🔐 Content Hash:</strong>
                            <code className="walrus-hash" title={entry.contentHash}>
                              {entry.contentHash.substring(0, 30)}...
                            </code>
                          </div>
                        )}
                        {entry.encrypted && <span className="encrypted-badge">🔒 Encrypted</span>}
                        <div className="walrus-network-badge">🟢 Walrus Testnet</div>
                      </div>
                    )}
                    <div className="entry-body">
                      <p><strong>Mood:</strong> {entry.mood?.current_mood} (Score: {entry.mood?.mood_score}/10)</p>
                      <p><strong>Sleep:</strong> {entry.health_metrics?.sleep?.hours} hours</p>
                      <p><strong>Stress Level:</strong> {entry.mental_health?.stress_level}/10</p>
                      {entry.mood?.description && (
                        <p><strong>Notes:</strong> {entry.mood.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Powered by Walrus & Sui Blockchain 🚀</p>
      </footer>
    </div>
  );
};

export default WellnessFormWithWalrus;

