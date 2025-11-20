// components/WellnessFormWithWalrus.jsx
import React, { useState } from 'react';
import WellnessForm from './WellnessForm';
import {
  storeWellnessEntry,
  retrieveWellnessEntry,
  createEncryptedEntry
} from '../services/walrusService';
import './WellnessFormWithWalrus.css';

const WellnessFormWithWalrus = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walrusIds, setWalrusIds] = useState({});
  const [showStorageStatus, setShowStorageStatus] = useState(false);
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [accessKey, setAccessKey] = useState('');

  /**
   * Handle form submission with Walrus storage
   */
  const handleFormSubmit = async (formData) => {
    setLoading(true);
    try {
      console.log('Processing wellness entry...');

      let storageResult;

      if (encryptionEnabled && accessKey) {
        // Create encrypted entry
        const encryptedEntry = await createEncryptedEntry(formData, accessKey);
        storageResult = await storeWellnessEntry(encryptedEntry);
      } else {
        // Store directly to Walrus
        storageResult = await storeWellnessEntry(formData);
      }

      // Create entry object with storage info
      const newEntry = {
        id: Date.now(),
        ...formData,
        walrusId: storageResult.walrusId,
        contentHash: storageResult.contentHash,
        size: storageResult.size,
        timestamp: storageResult.timestamp,
        encrypted: encryptionEnabled,
        created_at: new Date().toLocaleString()
      };

      // Update state
      setEntries([newEntry, ...entries]);
      setWalrusIds({
        ...walrusIds,
        [newEntry.id]: storageResult.walrusId
      });

      setShowStorageStatus(true);
      alert('✅ Wellness entry saved to Walrus blockchain!');

    } catch (error) {
      console.error('Error saving entry:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Retrieve entry from Walrus
   */
  const handleRetrieveEntry = async (entryId) => {
    setLoading(true);
    try {
      const walrusId = walrusIds[entryId];
      if (!walrusId) {
        alert('Walrus ID not found for this entry');
        return;
      }

      console.log('Retrieving entry from Walrus:', walrusId);
      const retrievedData = await retrieveWellnessEntry(walrusId);

      alert('✅ Entry retrieved from Walrus!\n\n' + JSON.stringify(retrievedData, null, 2));

    } catch (error) {
      console.error('Error retrieving entry:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wellness-container">
      <div className="form-wrapper">
        {/* Storage Options */}
        <div className="storage-options">
          <h3>🔒 Storage Options</h3>
          
          <div className="option-group">
            <label className="checkbox-option">
              <input
                type="checkbox"
                checked={encryptionEnabled}
                onChange={(e) => setEncryptionEnabled(e.target.checked)}
                disabled={loading}
              />
              <span>Enable Encryption (Seal)</span>
            </label>
          </div>

          {encryptionEnabled && (
            <div className="encryption-input">
              <label>Access Key (for decryption):</label>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter a secure key"
                disabled={loading}
              />
              <small>🔑 Keep this safe! You'll need it to decrypt your data.</small>
            </div>
          )}

          <div className="storage-info">
            <p>
              📦 <strong>Storage Provider:</strong> Walrus Decentralized Storage
            </p>
            <p>
              🔐 <strong>Encryption:</strong> {encryptionEnabled ? 'Enabled (Seal)' : 'Disabled'}
            </p>
            <p>
              💾 <strong>Entries Stored:</strong> {entries.length}
            </p>
          </div>
        </div>

        {/* Form */}
        <WellnessForm onSubmit={handleFormSubmit} />

        {/* Loading Indicator */}
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Processing and storing your wellness entry...</p>
          </div>
        )}
      </div>

      {/* Entries List */}
      {entries.length > 0 && (
        <div className="entries-wrapper">
          <div className="entries-header">
            <h3>📋 Stored Wellness Entries</h3>
            <p>{entries.length} entries on blockchain</p>
          </div>

          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry.id} className="entry-card-walrus">
                <div className="entry-main">
                  <div className="entry-info">
                    <div className="entry-date">
                      <strong>📅 {entry.date}</strong>
                      <span className="entry-time">{entry.created_at}</span>
                    </div>
                    
                    <div className="entry-details">
                      <div className="detail-item">
                        <span className="label">Mood:</span>
                        <span className="value">{entry.mood.current_mood} ({entry.mood.mood_score}/10)</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Sleep:</span>
                        <span className="value">{entry.health_metrics.sleep.hours}h (Quality: {entry.health_metrics.sleep.quality}/10)</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Stress:</span>
                        <span className="value">{entry.mental_health.stress_level}/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="entry-blockchain-info">
                    <div className="blockchain-item">
                      <strong>🔗 Blockchain ID:</strong>
                      <code>{entry.walrusId.slice(0, 16)}...{entry.walrusId.slice(-8)}</code>
                    </div>
                    <div className="blockchain-item">
                      <strong>✓ Hash:</strong>
                      <code>{entry.contentHash.slice(0, 16)}...{entry.contentHash.slice(-8)}</code>
                    </div>
                    <div className="blockchain-item">
                      <strong>📦 Size:</strong>
                      <span>{(entry.size / 1024).toFixed(2)} KB</span>
                    </div>
                    {entry.encrypted && (
                      <div className="blockchain-item encrypted">
                        <strong>🔒 Status:</strong>
                        <span>Encrypted</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="entry-actions">
                  <button
                    className="btn-retrieve"
                    onClick={() => handleRetrieveEntry(entry.id)}
                    disabled={loading}
                  >
                    🔍 Retrieve from Walrus
                  </button>
                  <button
                    className="btn-copy"
                    onClick={() => {
                      navigator.clipboard.writeText(entry.walrusId);
                      alert('✅ Walrus ID copied!');
                    }}
                  >
                    📋 Copy ID
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessFormWithWalrus;
