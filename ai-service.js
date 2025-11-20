// services/aiService.js
/**
 * AI Analysis Service for Wellness Journal
 * Performs machine learning analysis on wellness data
 */

/**
 * Analyze wellness data and calculate overall health score
 */
export const analyzeWellnessData = async (wellnessData) => {
  try {
    console.log('Analyzing wellness data...');

    // Calculate mood score
    const moodScore = calculateMoodScore(wellnessData);

    // Calculate sleep score
    const sleepScore = calculateSleepScore(wellnessData);

    // Calculate activity score
    const activityScore = calculateActivityScore(wellnessData);

    // Calculate stress score
    const stressScore = calculateStressScore(wellnessData);

    // Calculate mental health score
    const mentalScore = calculateMentalHealthScore(wellnessData);

    // Overall score (weighted average)
    const overallScore = Math.round(
      (moodScore * 0.2 +
        sleepScore * 0.25 +
        activityScore * 0.2 +
        stressScore * 0.15 +
        mentalScore * 0.2) * 100
    ) / 100;

    const status = getWellnessStatus(overallScore);

    const result = {
      overall_score: overallScore,
      mood_score: moodScore,
      sleep_score: sleepScore,
      activity_score: activityScore,
      stress_score: stressScore,
      mental_score: mentalScore,
      status: status,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Analysis complete:', result);
    return result;

  } catch (error) {
    console.error('❌ Analysis error:', error);
    throw error;
  }
};

/**
 * Calculate mood score from entries
 */
const calculateMoodScore = (data) => {
  if (data.length === 0) return 0;

  const moodMapping = {
    'happy': 0.95,
    'energetic': 0.9,
    'neutral': 0.5,
    'anxious': 0.3,
    'stressed': 0.2,
    'sad': 0.1
  };

  const totalScore = data.reduce((sum, entry) => {
    const typeScore = moodMapping[entry.mood.type] || 0.5;
    const numericScore = entry.mood.score / 10;
    return sum + (typeScore * 0.6 + numericScore * 0.4);
  }, 0);

  return totalScore / data.length;
};

/**
 * Calculate sleep score
 */
const calculateSleepScore = (data) => {
  if (data.length === 0) return 0;

  // Ideal sleep: 7-9 hours
  const totalScore = data.reduce((sum, entry) => {
    const hours = entry.sleep.hours;
    const quality = entry.sleep.quality / 10;

    let hourScore = 1;
    if (hours < 5) hourScore = 0.4;
    else if (hours < 7) hourScore = 0.7;
    else if (hours <= 9) hourScore = 1;
    else if (hours <= 10) hourScore = 0.9;
    else hourScore = 0.7;

    return sum + (hourScore * 0.6 + quality * 0.4);
  }, 0);

  return totalScore / data.length;
};

/**
 * Calculate activity/exercise score
 */
const calculateActivityScore = (data) => {
  if (data.length === 0) return 0;

  const intensityMapping = {
    'light': 0.4,
    'moderate': 0.7,
    'high': 1.0
  };

  let exerciseDays = 0;
  const totalScore = data.reduce((sum, entry) => {
    if (entry.exercise.type && entry.exercise.type !== '') {
      exerciseDays += 1;
      const intensity = intensityMapping[entry.exercise.intensity] || 0.5;
      const durationScore = Math.min(entry.exercise.duration / 60, 1);
      return sum + (intensity * 0.6 + durationScore * 0.4);
    }
    return sum + 0.2; // Sedentary day
  }, 0);

  const score = totalScore / data.length;
  const frequency = (exerciseDays / data.length) * 0.5 + 0.5;

  return score * frequency;
};

/**
 * Calculate stress score
 */
const calculateStressScore = (data) => {
  if (data.length === 0) return 0;

  // Lower stress is better, so inverse the score
  const totalScore = data.reduce((sum, entry) => {
    const stressLevel = entry.mental.stress / 10;
    const anxietyLevel = entry.mental.anxiety / 10;
    const average = (stressLevel + anxietyLevel) / 2;
    return sum + (1 - average);
  }, 0);

  return totalScore / data.length;
};

/**
 * Calculate mental health score
 */
const calculateMentalHealthScore = (data) => {
  if (data.length === 0) return 0;

  const totalScore = data.reduce((sum, entry) => {
    const gratitudeScore = entry.mental.gratitude ? 0.9 : 0.5;
    const stressReduction = Math.max(1 - (entry.mental.stress / 10), 0);
    const anxietyReduction = Math.max(1 - (entry.mental.anxiety / 10), 0);

    return sum + (gratitudeScore * 0.4 + stressReduction * 0.3 + anxietyReduction * 0.3);
  }, 0);

  return totalScore / data.length;
};

/**
 * Get wellness status based on score
 */
const getWellnessStatus = (score) => {
  if (score >= 0.85) return '🟢 Excellent';
  if (score >= 0.7) return '🟢 Good';
  if (score >= 0.55) return '🟡 Fair';
  if (score >= 0.4) return '🟠 Poor';
  return '🔴 Critical';
};

/**
 * Predict health risks
 */
export const predictHealthRisk = async (wellnessData) => {
  try {
    console.log('Predicting health risks...');

    const risks = [];

    // Sleep risk detection
    const sleepRisk = detectSleepRisk(wellnessData);
    if (sleepRisk) risks.push(sleepRisk);

    // Stress risk detection
    const stressRisk = detectStressRisk(wellnessData);
    if (stressRisk) risks.push(stressRisk);

    // Activity risk detection
    const activityRisk = detectActivityRisk(wellnessData);
    if (activityRisk) risks.push(activityRisk);

    // Mental health risk detection
    const mentalRisk = detectMentalHealthRisk(wellnessData);
    if (mentalRisk) risks.push(mentalRisk);

    // Symptom risk detection
    const symptomRisk = detectSymptomRisk(wellnessData);
    if (symptomRisk) risks.push(symptomRisk);

    console.log('✅ Risk prediction complete:', risks);
    return risks;

  } catch (error) {
    console.error('❌ Risk prediction error:', error);
    return [];
  }
};

const detectSleepRisk = (data) => {
  const avgSleep = data.reduce((sum, e) => sum + e.sleep.hours, 0) / data.length;

  if (avgSleep < 5) {
    return {
      name: 'Severe Sleep Deprivation',
      severity: 'critical',
      description: 'Your average sleep is below 5 hours. This significantly impacts health.',
      indicators: ['Low sleep duration', 'Sleep quality issues', 'Energy depletion'],
      recommendations: [
        'Consult a sleep specialist',
        'Establish consistent sleep schedule',
        'Avoid caffeine before bed',
        'Create dark sleeping environment'
      ]
    };
  }

  if (avgSleep < 6.5) {
    return {
      name: 'Insufficient Sleep',
      severity: 'high',
      description: 'You are getting less than recommended sleep.',
      indicators: ['Below 7 hours average', 'Irregular sleep pattern'],
      recommendations: [
        'Aim for 7-9 hours nightly',
        'Keep consistent bedtime',
        'Reduce blue light exposure'
      ]
    };
  }

  return null;
};

const detectStressRisk = (data) => {
  const avgStress = data.reduce((sum, e) => sum + e.mental.stress, 0) / data.length;
  const avgAnxiety = data.reduce((sum, e) => sum + e.mental.anxiety, 0) / data.length;

  if (avgStress > 8 || avgAnxiety > 8) {
    return {
      name: 'Chronic Stress',
      severity: 'critical',
      description: 'Stress and anxiety levels are critically high.',
      indicators: ['High stress level', 'High anxiety', 'Limited coping activities'],
      recommendations: [
        'Seek professional counseling',
        'Practice daily meditation (20 min)',
        'Regular exercise routine',
        'Social support activities'
      ]
    };
  }

  if (avgStress > 6.5 || avgAnxiety > 6.5) {
    return {
      name: 'Elevated Stress',
      severity: 'high',
      description: 'Stress levels are above healthy range.',
      indicators: ['Moderate stress', 'Anxiety concerns'],
      recommendations: [
        'Stress management techniques',
        'Meditation or yoga',
        'Adequate exercise',
        'Relaxation activities'
      ]
    };
  }

  return null;
};

const detectActivityRisk = (data) => {
  const exerciseDays = data.filter(e => e.exercise.type && e.exercise.type !== '').length;
  const exerciseRate = exerciseDays / data.length;

  if (exerciseRate < 0.2) {
    return {
      name: 'Sedentary Lifestyle',
      severity: 'high',
      description: 'Very low physical activity detected.',
      indicators: ['Minimal exercise', 'Sedentary pattern'],
      recommendations: [
        'Start with 20-30 min daily walks',
        'Build up gradually',
        'Find enjoyable activities',
        'Set weekly goals'
      ]
    };
  }

  if (exerciseRate < 0.43) {
    return {
      name: 'Low Physical Activity',
      severity: 'medium',
      description: 'Exercise frequency is below recommended levels.',
      indicators: ['Less than 3 days/week activity'],
      recommendations: [
        'Aim for 150 min moderate exercise/week',
        'Mix cardio and strength',
        'Schedule regular workouts'
      ]
    };
  }

  return null;
};

const detectMentalHealthRisk = (data) => {
  const lowGratitude = data.filter(e => !e.mental.gratitude || e.mental.gratitude.length < 10).length;
  const lowGratitudeRate = lowGratitude / data.length;

  if (lowGratitudeRate > 0.7) {
    return {
      name: 'Mental Wellness Concern',
      severity: 'medium',
      description: 'Low emotional resilience and gratitude patterns detected.',
      indicators: ['Low gratitude expression', 'Mood concerns'],
      recommendations: [
        'Practice daily gratitude journal',
        'Mindfulness meditation',
        'Social connection activities',
        'Positive affirmations'
      ]
    };
  }

  return null;
};

const detectSymptomRisk = (data) => {
  const withSymptoms = data.filter(e => e.symptoms.has_symptoms).length;
  const symptomRate = withSymptoms / data.length;

  if (symptomRate > 0.5) {
    return {
      name: 'Persistent Symptoms',
      severity: 'high',
      description: 'Frequent symptoms detected in your entries.',
      indicators: ['Multiple symptom reports', 'Recurring patterns'],
      recommendations: [
        'Consult healthcare provider',
        'Track symptom patterns',
        'Monitor severity changes',
        'Keep medical records'
      ]
    };
  }

  return null;
};

/**
 * Generate AI insights
 */
export const generateInsights = async (analysis) => {
  try {
    const insights = [];

    if (analysis.mood_score > 0.8) {
      insights.push({
        type: 'positive',
        title: 'Great Mood Pattern',
        description: 'Your mood scores are consistently high. Keep up the positive energy!'
      });
    }

    if (analysis.sleep_score > 0.85) {
      insights.push({
        type: 'positive',
        title: 'Healthy Sleep Schedule',
        description: 'Your sleep quality and duration are excellent. Continue this routine!'
      });
    }

    if (analysis.activity_score < 0.5) {
      insights.push({
        type: 'warning',
        title: 'Low Activity Level',
        description: 'Consider adding more physical activity to your routine for better health.'
      });
    }

    if (analysis.stress_score < 0.4) {
      insights.push({
        type: 'warning',
        title: 'High Stress Detected',
        description: 'Your stress levels are elevated. Try relaxation techniques or professional help.'
      });
    }

    if (analysis.overall_score >= 0.75) {
      insights.push({
        type: 'positive',
        title: 'Excellent Overall Wellness',
        description: 'Your overall wellness is in great shape. Maintain your healthy habits!'
      });
    }

    if (analysis.overall_score < 0.5) {
      insights.push({
        type: 'warning',
        title: 'Wellness Improvement Needed',
        description: 'Multiple areas need attention. Consider lifestyle changes or professional guidance.'
      });
    }

    return insights;

  } catch (error) {
    console.error('❌ Insight generation error:', error);
    return [];
  }
};

/**
 * Calculate trends over time
 */
export const calculateTrends = async (wellnessData) => {
  try {
    if (wellnessData.length < 2) {
      return null;
    }

    // Extract trend arrays
    const moodTrend = wellnessData.map(e => e.mood.score);
    const sleepTrend = wellnessData.map(e => e.sleep.hours);
    const stressTrend = wellnessData.map(e => e.mental.stress);

    // Calculate averages
    const moodAvg = moodTrend.reduce((a, b) => a + b, 0) / moodTrend.length;
    const sleepAvg = sleepTrend.reduce((a, b) => a + b, 0) / sleepTrend.length;
    const stressAvg = stressTrend.reduce((a, b) => a + b, 0) / stressTrend.length;

    // Detect trends (up/down)
    const moodDirection = moodTrend[moodTrend.length - 1] > moodAvg ? 'up' : 'down';
    const stressDirection = stressAvg > 6 ? 'increasing' : 'decreasing';

    // Sleep quality assessment
    const sleepQuality = sleepAvg >= 7 && sleepAvg <= 9 ? 'good' : 'needs improvement';

    // Exercise frequency
    const exerciseCount = wellnessData.filter(e => e.exercise.type && e.exercise.type !== '').length;
    const totalExerciseDuration = wellnessData.reduce((sum, e) => sum + (e.exercise.duration || 0), 0);

    const trends = {
      mood_trend: moodTrend,
      mood_avg: moodAvg,
      mood_direction: moodDirection,
      
      sleep_trend: sleepTrend,
      sleep_avg: sleepAvg,
      sleep_quality: sleepQuality,
      
      stress_trend: stressTrend,
      stress_avg: stressAvg,
      stress_direction: stressDirection,
      
      total_exercise_sessions: exerciseCount,
      avg_exercise_duration: exerciseCount > 0 ? totalExerciseDuration / exerciseCount : 0,
      most_common_exercise: getMostCommonExercise(wellnessData)
    };

    console.log('✅ Trends calculated:', trends);
    return trends;

  } catch (error) {
    console.error('❌ Trend calculation error:', error);
    return null;
  }
};

const getMostCommonExercise = (data) => {
  const exerciseTypes = {};
  data.forEach(entry => {
    if (entry.exercise.type) {
      exerciseTypes[entry.exercise.type] = (exerciseTypes[entry.exercise.type] || 0) + 1;
    }
  });

  if (Object.keys(exerciseTypes).length === 0) return 'None';
  return Object.keys(exerciseTypes).reduce((a, b) =>
    exerciseTypes[a] > exerciseTypes[b] ? a : b
  );
};

export default {
  analyzeWellnessData,
  predictHealthRisk,
  generateInsights,
  calculateTrends
};
