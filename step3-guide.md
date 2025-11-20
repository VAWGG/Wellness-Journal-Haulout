// Installation & Setup Guide for Step 3

## 📦 STEP 3: AI Analysis Component Installation

### Quick Start

**1. Install Dependencies**
```bash
npm install
# No additional ML library needed - we're using vanilla JavaScript ML algorithms
```

**2. Copy Files**
```
src/
├── components/
│   ├── AIAnalysisComponent.jsx
│   └── AIAnalysisComponent.css
├── services/
│   ├── aiService.js
│   └── walrusService.js
└── App.jsx (updated)
```

**3. Update Your App.jsx**
Replace your current App.jsx with the app-updated.jsx provided.

**4. Import in App**
```javascript
import AIAnalysisComponent from './components/AIAnalysisComponent';
```

**5. Run**
```bash
npm start
```

---

## 🤖 AI Analysis Features Included

### 1. Overall Wellness Score (0-100)
- Mood Score (20% weight)
- Sleep Score (25% weight)
- Activity Score (20% weight)
- Stress Score (15% weight)
- Mental Health Score (20% weight)

### 2. Health Risk Detection
- Sleep Deprivation Risk
- Chronic Stress Detection
- Sedentary Lifestyle Warning
- Mental Wellness Concerns
- Persistent Symptoms Alert

### 3. AI-Generated Insights
- Positive reinforcement messages
- Warning alerts
- Pattern recognition

### 4. Trend Analysis
- Mood trends (chart visualization)
- Sleep patterns
- Stress level progression
- Exercise frequency
- Individual metrics tracking

### 5. Personalized Recommendations
- Sleep improvement tips
- Stress management techniques
- Nutrition & hydration advice
- Physical activity suggestions

---

## 🎯 How It Works

### Data Flow:
```
Form Input (Wellness Entry)
        ↓
Store on Walrus + Blockchain
        ↓
AI Analysis Service (aiService.js)
        ↓
Calculate Multiple Scores
        ↓
Detect Health Risks
        ↓
Generate Insights
        ↓
Display on UI (AIAnalysisComponent)
```

### AI Algorithms Used:
- **Score Calculation:** Weighted averaging with domain-specific logic
- **Risk Detection:** Threshold-based pattern recognition
- **Trend Analysis:** Time-series data analysis
- **Insights Generation:** Rule-based recommendations

---

## 📊 Component Structure

### AIAnalysisComponent.jsx
```javascript
// Props
<AIAnalysisComponent entries={entries} />

// Features
- Auto-analyzes when entries change
- Shows overall wellness score
- Displays health risks with severity
- Key insights with icons
- Interactive trend tabs
- Personalized recommendations
```

### aiService.js Functions
```javascript
analyzeWellnessData(data)        // Calculate all scores
predictHealthRisk(data)          // Detect health risks
generateInsights(analysis)       // Create insight messages
calculateTrends(data)            // Analyze trends over time
```

---

## 🔧 Customization

### Adjust Score Weights
In `aiService.js`, find `analyzeWellnessData()`:
```javascript
const overallScore = (
  moodScore * 0.2 +      // Change these weights
  sleepScore * 0.25 +    // to customize scoring
  activityScore * 0.2 +
  stressScore * 0.15 +
  mentalScore * 0.2
);
```

### Modify Risk Thresholds
In risk detection functions:
```javascript
if (avgStress > 8) {  // Change threshold
  // Return high-severity risk
}
```

### Add More Insights
In `generateInsights()`:
```javascript
if (analysis.custom_metric > threshold) {
  insights.push({
    type: 'warning',
    title: 'Your Custom Insight',
    description: 'Custom description'
  });
}
```

---

## 📱 Responsive Design

- ✅ Mobile-friendly charts
- ✅ Adaptive grid layouts
- ✅ Touch-friendly tabs
- ✅ Responsive risk cards

---

## 🔐 Privacy & Security

**All data processing happens locally:**
- ✅ No API calls for analysis
- ✅ Data stays on user's device
- ✅ Encrypted storage on Walrus
- ✅ Blockchain verification

---

## ✅ Integration Checklist

- [ ] Copy AIAnalysisComponent.jsx to src/components/
- [ ] Copy aiService.js to src/services/
- [ ] Copy CSS files
- [ ] Update App.jsx with navigation
- [ ] Test form submission
- [ ] Test AI analysis tab
- [ ] Verify Walrus storage integration
- [ ] Test on mobile devices

---

## 🐛 Troubleshooting

**Analysis not showing?**
- Make sure you have at least 1 entry
- Check browser console for errors
- Verify aiService.js is imported correctly

**Scores not updating?**
- Clear browser cache
- Check that entries array is passing correctly
- Verify data format matches expectations

**Styling issues?**
- Import CSS files: `import './AIAnalysisComponent.css'`
- Check CSS file paths
- Verify no CSS conflicts

---

## 🎨 UI Components Included

1. **Overall Score Card** - Big number display with progress bar
2. **Risk Cards** - Color-coded severity levels
3. **Insight Cards** - Icon + title + description
4. **Trend Charts** - Mini bar chart visualizations
5. **Recommendation Cards** - Grid of actionable tips
6. **Tab Navigation** - Switch between metrics

---

## 📈 Next Steps After Step 3

This completes the AI x Data stack:
✅ Step 1: Form UI + Data Collection
✅ Step 2: Walrus Storage + Blockchain
✅ Step 3: AI Analysis & Insights
⏭️ Step 4: Sui Move Smart Contracts (optional)

For hackathon submission, you now have:
- Wellness form with data entry
- Decentralized storage on Walrus
- AI-powered health analysis
- Privacy-first architecture
- Full data provenance tracking

This demonstrates AI x Data track perfectly! 🚀
