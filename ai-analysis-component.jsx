// components/AIAnalysisComponent.jsx
import React, { useState, useEffect } from 'react';
import {
  analyzeWellnessData,
  predictHealthRisk,
  generateInsights,
  calculateTrends
} from '../services/aiService';
import './AIAnalysisComponent.css';

const AIAnalysisComponent = ({ entries }) => {
  const [analysis, setAnalysis] = useState(null);
  const [healthRisks, setHealthRisks] = useState([]);
  const [insights, setInsights] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('all');

  /**
   * Perform AI analysis on wellness entries
   */
  useEffect(() => {
    if (entries.length > 0) {
      performAnalysis();
    }
  }, [entries]);

  const performAnalysis = async () => {
    setLoading(true);
    try {
      // Prepare data
      const wellnessData = prepareData(entries);

      // Run analysis
      const analysisResult = await analyzeWellnessData(wellnessData);
      setAnalysis(analysisResult);

      // Predict health risks
      const risks = await predictHealthRisk(wellnessData);
      setHealthRisks(risks);

      // Generate insights
      const generatedInsights = await generateInsights(analysisResult);
      setInsights(generatedInsights);

      // Calculate trends
      const trendData = await calculateTrends(wellnessData);
      setTrends(trendData);

    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Prepare data for AI analysis
   */
  const prepareData = (entries) => {
    return entries.map(entry => ({
      date: entry.date,
      mood: {
        score: entry.mood.mood_score,
        type: entry.mood.current_mood
      },
      sleep: {
        hours: entry.health_metrics.sleep.hours,
        quality: entry.health_metrics.sleep.quality
      },
      exercise: {
        type: entry.health_metrics.exercise.type,
        duration: entry.health_metrics.exercise.duration_minutes,
        intensity: entry.health_metrics.exercise.intensity
      },
      nutrition: {
        water: entry.health_metrics.nutrition.water_intake,
        notes: entry.health_metrics.nutrition.notes
      },
      symptoms: entry.health_metrics.symptoms,
      mental: {
        stress: entry.mental_health.stress_level,
        anxiety: entry.mental_health.anxiety_level,
        gratitude: entry.mental_health.gratitude,
        challenges: entry.mental_health.challenges
      }
    }));
  };

  if (entries.length === 0) {
    return (
      <div className="ai-analysis-empty">
        <div className="empty-state">
          <h3>📊 AI Analysis</h3>
          <p>No entries yet. Start logging your wellness to see AI insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-analysis-container">
      <header className="analysis-header">
        <h2>🤖 Wellness AI Analysis</h2>
        <p>AI-powered insights based on your {entries.length} entries</p>
      </header>

      {loading && (
        <div className="loading-state">
          <div className="spinner-ai"></div>
          <p>Analyzing your wellness data...</p>
        </div>
      )}

      {!loading && analysis && (
        <>
          {/* Overall Health Score */}
          <section className="analysis-section health-score">
            <div className="score-card">
              <h3>Overall Wellness Score</h3>
              <div className="score-display">
                <div className="score-number">{analysis.overall_score}</div>
                <div className="score-bar">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${analysis.overall_score}%` }}
                  ></div>
                </div>
                <p className="score-status">{analysis.status}</p>
              </div>
            </div>
          </section>

          {/* Health Risks */}
          {healthRisks.length > 0 && (
            <section className="analysis-section risks">
              <h3>⚠️ Health Risk Assessment</h3>
              <div className="risks-grid">
                {healthRisks.map((risk, idx) => (
                  <div
                    key={idx}
                    className={`risk-card risk-${risk.severity}`}
                  >
                    <div className="risk-header">
                      <strong>{risk.name}</strong>
                      <span className={`risk-badge ${risk.severity}`}>
                        {risk.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="risk-description">{risk.description}</p>
                    <div className="risk-indicators">
                      {risk.indicators.map((indicator, i) => (
                        <span key={i} className="indicator">
                          {indicator}
                        </span>
                      ))}
                    </div>
                    <div className="risk-actions">
                      <strong>Recommendations:</strong>
                      <ul>
                        {risk.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Insights */}
          {insights.length > 0 && (
            <section className="analysis-section insights">
              <h3>💡 Key Insights</h3>
              <div className="insights-list">
                {insights.map((insight, idx) => (
                  <div key={idx} className={`insight-item insight-${insight.type}`}>
                    <div className="insight-icon">
                      {insight.type === 'positive' && '✅'}
                      {insight.type === 'warning' && '⚠️'}
                      {insight.type === 'info' && 'ℹ️'}
                    </div>
                    <div className="insight-content">
                      <strong>{insight.title}</strong>
                      <p>{insight.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trends Analysis */}
          {trends && (
            <section className="analysis-section trends">
              <h3>📈 Trends Over Time</h3>
              
              <div className="trends-tabs">
                {['all', 'mood', 'sleep', 'stress', 'exercise'].map(tab => (
                  <button
                    key={tab}
                    className={`tab ${selectedMetric === tab ? 'active' : ''}`}
                    onClick={() => setSelectedMetric(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="trends-content">
                {selectedMetric === 'all' || selectedMetric === 'mood' && (
                  <div className="trend-card">
                    <h4>Mood Trend</h4>
                    <div className="trend-chart">
                      <div className="trend-bars">
                        {trends.mood_trend?.map((val, idx) => (
                          <div
                            key={idx}
                            className="trend-bar"
                            style={{ height: `${val * 10}%` }}
                            title={`${val}/10`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="trend-stat">
                      Average: {trends.mood_avg?.toFixed(1)}/10
                      {trends.mood_direction === 'up' && ' 📈'}
                      {trends.mood_direction === 'down' && ' 📉'}
                    </p>
                  </div>
                )}

                {selectedMetric === 'all' || selectedMetric === 'sleep' && (
                  <div className="trend-card">
                    <h4>Sleep Pattern</h4>
                    <div className="trend-chart">
                      <div className="trend-bars">
                        {trends.sleep_trend?.map((val, idx) => (
                          <div
                            key={idx}
                            className="trend-bar"
                            style={{ height: `${(val / 12) * 100}%` }}
                            title={`${val}h`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="trend-stat">
                      Average: {trends.sleep_avg?.toFixed(1)} hours
                      {trends.sleep_quality === 'good' && ' ✅'}
                      {trends.sleep_quality === 'poor' && ' ⚠️'}
                    </p>
                  </div>
                )}

                {selectedMetric === 'all' || selectedMetric === 'stress' && (
                  <div className="trend-card">
                    <h4>Stress Level</h4>
                    <div className="trend-chart">
                      <div className="trend-bars">
                        {trends.stress_trend?.map((val, idx) => (
                          <div
                            key={idx}
                            className="trend-bar stress-bar"
                            style={{ height: `${val * 10}%` }}
                            title={`${val}/10`}
                          ></div>
                        ))}
                      </div>
                    </div>
                    <p className="trend-stat">
                      Average: {trends.stress_avg?.toFixed(1)}/10
                      {trends.stress_direction === 'decreasing' && ' 👍'}
                      {trends.stress_direction === 'increasing' && ' ⚠️'}
                    </p>
                  </div>
                )}

                {selectedMetric === 'all' || selectedMetric === 'exercise' && (
                  <div className="trend-card">
                    <h4>Exercise Activity</h4>
                    <div className="activity-summary">
                      <p>Total Sessions: <strong>{trends.total_exercise_sessions}</strong></p>
                      <p>Average Duration: <strong>{trends.avg_exercise_duration?.toFixed(0)} min</strong></p>
                      <p>Most Common: <strong>{trends.most_common_exercise}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Recommendations */}
          <section className="analysis-section recommendations">
            <h3>🎯 Personalized Recommendations</h3>
            <div className="recommendations-grid">
              <div className="recommendation-card">
                <h4>Sleep Improvement</h4>
                <ul>
                  <li>Target: 7-9 hours per night</li>
                  <li>Maintain consistent sleep schedule</li>
                  <li>Reduce screen time before bed</li>
                </ul>
              </div>

              <div className="recommendation-card">
                <h4>Stress Management</h4>
                <ul>
                  <li>Practice daily meditation (10-15 min)</li>
                  <li>Regular exercise 3-4x per week</li>
                  <li>Mindfulness techniques</li>
                </ul>
              </div>

              <div className="recommendation-card">
                <h4>Nutrition & Hydration</h4>
                <ul>
                  <li>Drink 8-10 glasses of water daily</li>
                  <li>Balanced meals 3x per day</li>
                  <li>Track food intake patterns</li>
                </ul>
              </div>

              <div className="recommendation-card">
                <h4>Physical Activity</h4>
                <ul>
                  <li>Aim for 150 min moderate exercise/week</li>
                  <li>Mix cardio and strength training</li>
                  <li>Daily walks or stretching</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Privacy Notice */}
          <section className="analysis-section privacy-notice">
            <p>
              🔒 <strong>Privacy Notice:</strong> This AI analysis is performed locally on your device.
              Your data is encrypted and stored on Walrus blockchain. No personal data is sent to external servers.
            </p>
          </section>
        </>
      )}
    </div>
  );
};

export default AIAnalysisComponent;
