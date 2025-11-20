/**
 * AI Service - Wellness Analysis & Insights
 * Provides AI-powered analysis, risk detection, and recommendations
 */

/**
 * Calculate overall wellness score (0-100)
 * @param {Object} entry - Wellness entry data
 * @returns {Object} - { score, status, breakdown }
 */
export const calculateWellnessScore = (entry) => {
  const weights = {
    mood: 0.25,
    sleep: 0.20,
    exercise: 0.15,
    stress: 0.20,
    mentalHealth: 0.20
  };

  // Calculate individual scores
  const moodScore = entry.mood?.mood_score ? (entry.mood.mood_score / 10) * 100 : 50;
  const sleepScore = calculateSleepScore(entry.health_metrics?.sleep);
  const exerciseScore = calculateExerciseScore(entry.health_metrics?.exercise);
  const stressScore = calculateStressScore(entry.mental_health);
  const mentalHealthScore = calculateMentalHealthScore(entry.mental_health);

  // Weighted average
  const overallScore = Math.round(
    moodScore * weights.mood +
    sleepScore * weights.sleep +
    exerciseScore * weights.exercise +
    stressScore * weights.stress +
    mentalHealthScore * weights.mentalHealth
  );

  // Determine status
  let status = 'Excellent';
  let statusColor = '#10b981'; // green
  if (overallScore < 40) {
    status = 'Critical';
    statusColor = '#ef4444'; // red
  } else if (overallScore < 60) {
    status = 'Needs Attention';
    statusColor = '#f59e0b'; // orange
  } else if (overallScore < 80) {
    status = 'Good';
    statusColor = '#3b82f6'; // blue
  }

  return {
    score: overallScore,
    status,
    statusColor,
    breakdown: {
      mood: Math.round(moodScore),
      sleep: Math.round(sleepScore),
      exercise: Math.round(exerciseScore),
      stress: Math.round(stressScore),
      mentalHealth: Math.round(mentalHealthScore)
    }
  };
};

/**
 * Calculate sleep score
 */
const calculateSleepScore = (sleep) => {
  if (!sleep) return 50;
  
  const hours = sleep.hours || 0;
  const quality = sleep.quality || 5;
  
  // Optimal: 7-9 hours, quality 7+
  let score = 50;
  
  if (hours >= 7 && hours <= 9) {
    score += 30;
  } else if (hours >= 6 && hours <= 10) {
    score += 20;
  } else if (hours < 6 || hours > 10) {
    score -= 20;
  }
  
  score += (quality - 5) * 4;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate exercise score
 */
const calculateExerciseScore = (exercise) => {
  if (!exercise || !exercise.type) return 30;
  
  const duration = exercise.duration_minutes || 0;
  const intensity = exercise.intensity || 'moderate';
  
  let score = 30;
  
  // Duration scoring
  if (duration >= 30) {
    score += 40;
  } else if (duration >= 15) {
    score += 25;
  } else if (duration > 0) {
    score += 10;
  }
  
  // Intensity bonus
  if (intensity === 'high') score += 10;
  else if (intensity === 'moderate') score += 5;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate stress score (inverse - lower stress = higher score)
 */
const calculateStressScore = (mentalHealth) => {
  if (!mentalHealth) return 50;
  
  const stressLevel = mentalHealth.stress_level || 5;
  const anxietyLevel = mentalHealth.anxiety_level || 5;
  
  // Lower stress/anxiety = higher score
  const avgStress = (stressLevel + anxietyLevel) / 2;
  const score = 100 - (avgStress - 1) * 10;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Calculate mental health score
 */
const calculateMentalHealthScore = (mentalHealth) => {
  if (!mentalHealth) return 50;
  
  let score = 50;
  
  // Gratitude presence
  if (mentalHealth.gratitude && mentalHealth.gratitude.length > 10) {
    score += 20;
  }
  
  // Challenges handling
  if (mentalHealth.challenges && mentalHealth.challenges.length > 0) {
    score += 10; // Acknowledging challenges is positive
  }
  
  // Stress and anxiety (inverse)
  const stressLevel = mentalHealth.stress_level || 5;
  const anxietyLevel = mentalHealth.anxiety_level || 5;
  score -= (stressLevel + anxietyLevel - 10) * 3;
  
  return Math.max(0, Math.min(100, score));
};

/**
 * Detect health risks
 * @param {Object} entry - Wellness entry data
 * @returns {Array} - Array of risk objects
 */
export const detectHealthRisks = (entry) => {
  const risks = [];

  // Sleep deprivation
  const sleepHours = entry.health_metrics?.sleep?.hours || 0;
  if (sleepHours < 6) {
    risks.push({
      type: 'sleep_deprivation',
      severity: sleepHours < 4 ? 'high' : 'medium',
      message: `⚠️ Sleep Deprivation: Only ${sleepHours} hours of sleep detected. Recommended: 7-9 hours.`,
      recommendation: 'Try to establish a consistent sleep schedule and create a relaxing bedtime routine.'
    });
  }

  // High stress
  const stressLevel = entry.mental_health?.stress_level || 5;
  if (stressLevel >= 8) {
    risks.push({
      type: 'high_stress',
      severity: 'high',
      message: `🔴 High Stress Alert: Stress level at ${stressLevel}/10.`,
      recommendation: 'Consider stress management techniques like meditation, deep breathing, or taking breaks.'
    });
  }

  // High anxiety
  const anxietyLevel = entry.mental_health?.anxiety_level || 5;
  if (anxietyLevel >= 8) {
    risks.push({
      type: 'high_anxiety',
      severity: 'high',
      message: `😰 Anxiety Alert: Anxiety level at ${anxietyLevel}/10.`,
      recommendation: 'Practice mindfulness, consider talking to someone, or try relaxation exercises.'
    });
  }

  // Sedentary lifestyle
  const exerciseDuration = entry.health_metrics?.exercise?.duration_minutes || 0;
  if (exerciseDuration === 0) {
    risks.push({
      type: 'sedentary',
      severity: 'medium',
      message: '🏃 Sedentary Lifestyle: No physical activity recorded today.',
      recommendation: 'Aim for at least 30 minutes of moderate activity daily. Start with a 10-minute walk!'
    });
  } else if (exerciseDuration < 15) {
    risks.push({
      type: 'low_activity',
      severity: 'low',
      message: `📉 Low Activity: Only ${exerciseDuration} minutes of exercise today.`,
      recommendation: 'Try to increase activity gradually. The WHO recommends 150 minutes per week.'
    });
  }

  // Mental wellness concerns
  const moodScore = entry.mood?.mood_score || 5;
  if (moodScore <= 3) {
    risks.push({
      type: 'low_mood',
      severity: 'high',
      message: `😔 Low Mood Detected: Mood score is ${moodScore}/10.`,
      recommendation: 'Consider reaching out to friends, family, or a mental health professional for support.'
    });
  }

  // Symptoms tracking
  if (entry.health_metrics?.symptoms?.has_symptoms) {
    const severity = entry.health_metrics.symptoms.severity || 0;
    if (severity >= 7) {
      risks.push({
        type: 'severe_symptoms',
        severity: 'high',
        message: `🏥 Severe Symptoms: Symptom severity at ${severity}/10.`,
        recommendation: 'Consider consulting with a healthcare professional if symptoms persist.'
      });
    }
  }

  return risks;
};

/**
 * Generate AI insights
 * @param {Object} entry - Current entry
 * @param {Array} previousEntries - Previous entries for pattern recognition
 * @returns {Array} - Array of insight objects
 */
export const generateInsights = (entry, previousEntries = []) => {
  const insights = [];

  // Positive reinforcement
  const wellnessScore = calculateWellnessScore(entry);
  if (wellnessScore.score >= 80) {
    insights.push({
      type: 'positive',
      message: '🌟 Excellent! You\'re maintaining great wellness habits. Keep it up!',
      icon: '✨'
    });
  }

  // Mood insights
  const moodScore = entry.mood?.mood_score || 5;
  if (moodScore >= 8) {
    insights.push({
      type: 'positive',
      message: '😊 Great mood today! Your positive energy is wonderful.',
      icon: '😊'
    });
  }

  // Sleep insights
  const sleepHours = entry.health_metrics?.sleep?.hours || 0;
  if (sleepHours >= 7 && sleepHours <= 9) {
    insights.push({
      type: 'positive',
      message: '💤 Perfect sleep duration! You\'re getting the recommended 7-9 hours.',
      icon: '💤'
    });
  }

  // Gratitude insights
  if (entry.mental_health?.gratitude && entry.mental_health.gratitude.length > 20) {
    insights.push({
      type: 'positive',
      message: '🙏 Practicing gratitude is excellent for mental wellness!',
      icon: '🙏'
    });
  }

  // Pattern recognition
  if (previousEntries.length >= 3) {
    const recentMoods = previousEntries.slice(0, 3).map(e => e.mood?.mood_score || 5);
    const avgMood = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
    
    if (avgMood < 4) {
      insights.push({
        type: 'warning',
        message: '📊 Pattern Alert: Your mood has been consistently low over the past few days.',
        icon: '📊'
      });
    }

    const recentSleep = previousEntries.slice(0, 3).map(e => e.health_metrics?.sleep?.hours || 0);
    const avgSleep = recentSleep.reduce((a, b) => a + b, 0) / recentSleep.length;
    
    if (avgSleep < 6) {
      insights.push({
        type: 'warning',
        message: '📊 Pattern Alert: You\'ve been getting insufficient sleep consistently.',
        icon: '📊'
      });
    }
  }

  return insights;
};

/**
 * Analyze trends across entries
 * @param {Array} entries - Array of wellness entries
 * @returns {Object} - Trend analysis data
 */
export const analyzeTrends = (entries) => {
  if (!entries || entries.length === 0) {
    return {
      mood: { trend: 'stable', data: [] },
      sleep: { trend: 'stable', data: [] },
      stress: { trend: 'stable', data: [] },
      exercise: { trend: 'stable', data: [] }
    };
  }

  // Sort by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date || b.timestamp) - new Date(a.date || a.timestamp)
  );

  // Extract data points
  const moodData = sortedEntries.map(e => ({
    date: e.date || e.timestamp,
    value: e.mood?.mood_score || 5
  }));

  const sleepData = sortedEntries.map(e => ({
    date: e.date || e.timestamp,
    value: e.health_metrics?.sleep?.hours || 0
  }));

  const stressData = sortedEntries.map(e => ({
    date: e.date || e.timestamp,
    value: e.mental_health?.stress_level || 5
  }));

  const exerciseData = sortedEntries.map(e => ({
    date: e.date || e.timestamp,
    value: e.health_metrics?.exercise?.duration_minutes || 0
  }));

  // Calculate trends
  const calculateTrend = (data) => {
    if (data.length < 2) return 'stable';
    
    const recent = data.slice(0, Math.min(3, data.length));
    const older = data.slice(Math.min(3, data.length), Math.min(6, data.length));
    
    if (older.length === 0) return 'stable';
    
    const recentAvg = recent.reduce((a, b) => a + b.value, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.value, 0) / older.length;
    
    const diff = recentAvg - olderAvg;
    if (diff > 0.5) return 'improving';
    if (diff < -0.5) return 'declining';
    return 'stable';
  };

  return {
    mood: {
      trend: calculateTrend(moodData),
      data: moodData.reverse() // Reverse for chronological order
    },
    sleep: {
      trend: calculateTrend(sleepData),
      data: sleepData.reverse()
    },
    stress: {
      trend: calculateTrend(stressData),
      data: stressData.reverse()
    },
    exercise: {
      trend: calculateTrend(exerciseData),
      data: exerciseData.reverse()
    }
  };
};

/**
 * Generate personalized recommendations
 * @param {Object} entry - Current entry
 * @param {Array} previousEntries - Previous entries
 * @returns {Array} - Array of recommendation objects
 */
export const generateRecommendations = (entry, previousEntries = []) => {
  const recommendations = [];

  // Sleep recommendations
  const sleepHours = entry.health_metrics?.sleep?.hours || 0;
  if (sleepHours < 7) {
    recommendations.push({
      category: 'sleep',
      priority: 'high',
      title: 'Improve Sleep Quality',
      suggestions: [
        'Establish a consistent bedtime routine',
        'Avoid screens 1 hour before bed',
        'Keep your bedroom cool and dark',
        'Limit caffeine intake after 2 PM',
        'Try relaxation techniques like meditation'
      ]
    });
  }

  // Stress management
  const stressLevel = entry.mental_health?.stress_level || 5;
  if (stressLevel >= 7) {
    recommendations.push({
      category: 'stress',
      priority: 'high',
      title: 'Stress Management',
      suggestions: [
        'Practice deep breathing exercises (4-7-8 technique)',
        'Take regular breaks throughout the day',
        'Try progressive muscle relaxation',
        'Consider mindfulness meditation',
        'Engage in activities you enjoy'
      ]
    });
  }

  // Physical activity
  const exerciseDuration = entry.health_metrics?.exercise?.duration_minutes || 0;
  if (exerciseDuration < 30) {
    recommendations.push({
      category: 'exercise',
      priority: 'medium',
      title: 'Increase Physical Activity',
      suggestions: [
        'Aim for 30 minutes of moderate activity daily',
        'Start with 10-minute walks and gradually increase',
        'Try activities you enjoy: dancing, cycling, swimming',
        'Use stairs instead of elevators',
        'Take walking breaks during work'
      ]
    });
  }

  // Nutrition & hydration
  const waterIntake = entry.health_metrics?.nutrition?.water_intake || 0;
  if (waterIntake < 8) {
    recommendations.push({
      category: 'nutrition',
      priority: 'medium',
      title: 'Hydration Goals',
      suggestions: [
        'Aim for 8-10 glasses of water daily',
        'Keep a water bottle nearby',
        'Set hourly hydration reminders',
        'Include water-rich foods in your diet',
        'Monitor your hydration throughout the day'
      ]
    });
  }

  // Mental wellness
  const moodScore = entry.mood?.mood_score || 5;
  if (moodScore <= 5) {
    recommendations.push({
      category: 'mental_health',
      priority: 'high',
      title: 'Mental Wellness Support',
      suggestions: [
        'Practice daily gratitude journaling',
        'Connect with friends and family',
        'Engage in hobbies and activities you love',
        'Consider talking to a mental health professional',
        'Practice self-compassion and self-care'
      ]
    });
  }

  return recommendations;
};



