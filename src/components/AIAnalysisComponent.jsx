import React, { useState, useEffect } from 'react';
import {
  calculateWellnessScore,
  detectHealthRisks,
  generateInsights,
  analyzeTrends,
  generateRecommendations
} from '../services/aiService';
import './AIAnalysisComponent.css';

const AIAnalysisComponent = ({ entries = [] }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  // Analyze latest entry or selected entry
  useEffect(() => {
    const entryToAnalyze = selectedEntry || entries[0];
    if (entryToAnalyze) {
      const wellnessScore = calculateWellnessScore(entryToAnalyze);
      const risks = detectHealthRisks(entryToAnalyze);
      const insights = generateInsights(entryToAnalyze, entries);
      const trends = analyzeTrends(entries);
      const recommendations = generateRecommendations(entryToAnalyze, entries);

      setAnalysis({
        wellnessScore,
        risks,
        insights,
        trends,
        recommendations,
        entry: entryToAnalyze
      });
    }
  }, [entries, selectedEntry]);

  if (!analysis || entries.length === 0) {
    return (
      <div className="ai-analysis-container">
        <div className="no-data-message">
          <h3>📊 AI Analysis</h3>
          <p>No wellness entries available for analysis. Please create an entry first.</p>
        </div>
      </div>
    );
  }

  const { wellnessScore, risks, insights, trends, recommendations } = analysis;

  return (
    <div className="ai-analysis-container">
      <div className="analysis-header">
        <h2>🤖 AI Wellness Analysis</h2>
        <p>Powered by advanced AI algorithms</p>
      </div>

      {/* Entry Selector */}
      {entries.length > 1 && (
        <div className="entry-selector">
          <label>Analyze Entry:</label>
          <select
            value={selectedEntry?.id || entries[0]?.id}
            onChange={(e) => {
              const entry = entries.find(ent => ent.id === parseInt(e.target.value));
              setSelectedEntry(entry);
            }}
          >
            {entries.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.date || entry.timestamp} - Entry #{entries.length - entries.indexOf(entry)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Overall Wellness Score */}
      <div className="wellness-score-card">
        <h3>📊 Overall Wellness Score</h3>
        <div className="score-display">
          <div className="score-circle" style={{ '--score': wellnessScore.score, '--color': wellnessScore.statusColor }}>
            <span className="score-value">{wellnessScore.score}</span>
            <span className="score-label">/ 100</span>
          </div>
          <div className="score-status">
            <span className="status-badge" style={{ backgroundColor: wellnessScore.statusColor }}>
              {wellnessScore.status}
            </span>
          </div>
        </div>
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Mood</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ width: `${wellnessScore.breakdown.mood}%`, backgroundColor: '#667eea' }}
              ></div>
              <span className="breakdown-value">{wellnessScore.breakdown.mood}%</span>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Sleep</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ width: `${wellnessScore.breakdown.sleep}%`, backgroundColor: '#764ba2' }}
              ></div>
              <span className="breakdown-value">{wellnessScore.breakdown.sleep}%</span>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Exercise</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ width: `${wellnessScore.breakdown.exercise}%`, backgroundColor: '#10b981' }}
              ></div>
              <span className="breakdown-value">{wellnessScore.breakdown.exercise}%</span>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Stress</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ width: `${wellnessScore.breakdown.stress}%`, backgroundColor: '#f59e0b' }}
              ></div>
              <span className="breakdown-value">{wellnessScore.breakdown.stress}%</span>
            </div>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Mental Health</span>
            <div className="breakdown-bar">
              <div 
                className="breakdown-fill" 
                style={{ width: `${wellnessScore.breakdown.mentalHealth}%`, backgroundColor: '#3b82f6' }}
              ></div>
              <span className="breakdown-value">{wellnessScore.breakdown.mentalHealth}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="analysis-tabs">
        <button
          className={activeTab === 'overview' ? 'tab-active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button
          className={activeTab === 'risks' ? 'tab-active' : ''}
          onClick={() => setActiveTab('risks')}
        >
          ⚠️ Risks ({risks.length})
        </button>
        <button
          className={activeTab === 'insights' ? 'tab-active' : ''}
          onClick={() => setActiveTab('insights')}
        >
          💡 Insights ({insights.length})
        </button>
        <button
          className={activeTab === 'trends' ? 'tab-active' : ''}
          onClick={() => setActiveTab('trends')}
        >
          📈 Trends
        </button>
        <button
          className={activeTab === 'recommendations' ? 'tab-active' : ''}
          onClick={() => setActiveTab('recommendations')}
        >
          🎯 Recommendations
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="insights-preview">
              <h4>💡 Key Insights</h4>
              {insights.slice(0, 3).map((insight, idx) => (
                <div key={idx} className={`insight-item insight-${insight.type}`}>
                  <span className="insight-icon">{insight.icon}</span>
                  <span className="insight-message">{insight.message}</span>
                </div>
              ))}
            </div>

            <div className="risks-preview">
              <h4>⚠️ Health Risks</h4>
              {risks.length === 0 ? (
                <p className="no-risks">✅ No significant health risks detected!</p>
              ) : (
                risks.slice(0, 3).map((risk, idx) => (
                  <div key={idx} className={`risk-item risk-${risk.severity}`}>
                    <span className="risk-message">{risk.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="risks-content">
            {risks.length === 0 ? (
              <div className="no-risks-message">
                <span className="success-icon">✅</span>
                <h3>No Health Risks Detected</h3>
                <p>Great job! Your wellness metrics are within healthy ranges.</p>
              </div>
            ) : (
              risks.map((risk, idx) => (
                <div key={idx} className={`risk-card risk-${risk.severity}`}>
                  <div className="risk-header">
                    <span className="risk-severity-badge">{risk.severity.toUpperCase()}</span>
                    <span className="risk-message">{risk.message}</span>
                  </div>
                  <div className="risk-recommendation">
                    <strong>💡 Recommendation:</strong> {risk.recommendation}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="insights-content">
            {insights.length === 0 ? (
              <p>No insights available for this entry.</p>
            ) : (
              insights.map((insight, idx) => (
                <div key={idx} className={`insight-card insight-${insight.type}`}>
                  <span className="insight-icon-large">{insight.icon}</span>
                  <p className="insight-message">{insight.message}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Trends Tab */}
        {activeTab === 'trends' && (
          <div className="trends-content">
            <div className="trend-chart">
              <h4>😊 Mood Trend</h4>
              <div className="trend-indicator">
                <span className={`trend-arrow trend-${trends.mood.trend}`}>
                  {trends.mood.trend === 'improving' ? '📈' : trends.mood.trend === 'declining' ? '📉' : '➡️'}
                </span>
                <span className="trend-label">{trends.mood.trend.toUpperCase()}</span>
              </div>
              <div className="chart-container">
                {trends.mood.data.map((point, idx) => (
                  <div key={idx} className="chart-bar" style={{ height: `${(point.value / 10) * 100}%` }}>
                    <span className="chart-value">{point.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-chart">
              <h4>💤 Sleep Trend</h4>
              <div className="trend-indicator">
                <span className={`trend-arrow trend-${trends.sleep.trend}`}>
                  {trends.sleep.trend === 'improving' ? '📈' : trends.sleep.trend === 'declining' ? '📉' : '➡️'}
                </span>
                <span className="trend-label">{trends.sleep.trend.toUpperCase()}</span>
              </div>
              <div className="chart-container">
                {trends.sleep.data.map((point, idx) => (
                  <div key={idx} className="chart-bar" style={{ height: `${(point.value / 10) * 100}%` }}>
                    <span className="chart-value">{point.value}h</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-chart">
              <h4>😰 Stress Trend</h4>
              <div className="trend-indicator">
                <span className={`trend-arrow trend-${trends.stress.trend}`}>
                  {trends.stress.trend === 'improving' ? '📉' : trends.stress.trend === 'declining' ? '📈' : '➡️'}
                </span>
                <span className="trend-label">{trends.stress.trend.toUpperCase()}</span>
              </div>
              <div className="chart-container">
                {trends.stress.data.map((point, idx) => (
                  <div key={idx} className="chart-bar" style={{ height: `${(point.value / 10) * 100}%` }}>
                    <span className="chart-value">{point.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="trend-chart">
              <h4>🏃 Exercise Trend</h4>
              <div className="trend-indicator">
                <span className={`trend-arrow trend-${trends.exercise.trend}`}>
                  {trends.exercise.trend === 'improving' ? '📈' : trends.exercise.trend === 'declining' ? '📉' : '➡️'}
                </span>
                <span className="trend-label">{trends.exercise.trend.toUpperCase()}</span>
              </div>
              <div className="chart-container">
                {trends.exercise.data.map((point, idx) => (
                  <div key={idx} className="chart-bar" style={{ height: `${Math.min((point.value / 60) * 100, 100)}%` }}>
                    <span className="chart-value">{point.value}m</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="recommendations-content">
            {recommendations.length === 0 ? (
              <div className="no-recommendations">
                <span className="success-icon">✅</span>
                <h3>All Good!</h3>
                <p>Your wellness metrics are excellent. Keep up the great work!</p>
              </div>
            ) : (
              recommendations.map((rec, idx) => (
                <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
                  <div className="rec-header">
                    <h4>{rec.title}</h4>
                    <span className={`priority-badge priority-${rec.priority}`}>
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  <ul className="rec-suggestions">
                    {rec.suggestions.map((suggestion, sIdx) => (
                      <li key={sIdx}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAnalysisComponent;



