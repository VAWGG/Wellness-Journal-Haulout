import React, { useState } from 'react';
import './WellnessForm.css';

const WellnessForm = ({ onSubmit }) => {
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="wellness-form">
      <h2>Wellness Journal Entry</h2>
      
      {/* MOOD SECTION */}
      <section className="form-section">
        <h3>😊 Mood</h3>
        
        <div className


