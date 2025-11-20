# 🌟 Wellness Journal - AI x Data Hackathon

## 🎯 Project Overview

Wellness Journal is a decentralized health tracking application built for the **Haulout Hackathon AI x Data track**. It combines:

- 📝 **Wellness form** for daily health & mood data collection
- 🔗 **Decentralized storage** (Walrus mock, ready for testnet integration)
- 🔒 **Optional Seal encryption** for privacy protection
- 🤖 **AI-powered health insights** and risk detection
- 📊 **Blockchain verification** (mock, ready for Sui testnet)
- 📈 **Trend analysis** and personalized recommendations

## 🚀 Features

### Data Collection
- **Mood tracking** (1-10 scale with descriptions)
- **Sleep quality monitoring** (hours, quality score, notes)
- **Exercise logging** (type, duration, intensity)
- **Nutrition tracking** (meals, water intake)
- **Symptom recording** (severity, symptom list)
- **Mental health assessment** (stress, anxiety, gratitude, challenges)
- **General wellness notes**

### Blockchain Integration
- ✅ **Store entries** on Walrus decentralized storage (mock flow, ready for testnet)
- ✅ **Optional Seal encryption** for privacy (AES encryption)
- ✅ **Sui blockchain** for data verification (mock, ready for testnet)
- ✅ **Immutable health records** with content hash verification
- ✅ **Walrus ID** generation for each entry (unique identifier)

### AI Analysis
- **Overall wellness score** (0-100 weighted calculation)
- **Health risk detection** (sleep deprivation, high stress, sedentary lifestyle, etc.)
- **Trend analysis** (mood, sleep, stress, exercise patterns)
- **Personalized insights** (positive reinforcement, warnings, pattern recognition)
- **Actionable recommendations** (priority-based suggestions)

## 🛠️ Tech Stack

### Frontend
- **React.js** 18.2.0
- **Modern CSS** with gradients and animations
- **Responsive Design** (mobile-friendly)
- **Component-based architecture**

### Blockchain (Mock for Hackathon, Ready for Testnet)
- **Sui Network** (Testnet ready)
- **Walrus Storage** (mock implementation, ready for `WalrusClient.writeBlob()`)
- **Seal Encryption** (AES encryption via crypto-js)
- **Move Smart Contracts** (mock, ready for testnet deployment)

### AI/ML
- **Vanilla JavaScript** algorithms
- **No external ML libraries** needed
- **Local processing only** (privacy-first)
- **Weighted scoring system**
- **Pattern recognition algorithms**

## 📦 Installation

### Prerequisites
- **Node.js** >= 16
- **npm** or **yarn**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Setup

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/wellness-journal-haulout.git
cd wellness-journal-haulout

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### Environment Variables (Optional)

Create `.env.local` file:

```bash
# Walrus RPC Configuration (for future testnet integration)
REACT_APP_WALRUS_RPC_URL=https://walrus-testnet-rpc.mystenlabs.com

# Sui Configuration (for future testnet integration)
REACT_APP_SUI_RPC_URL=https://fullnode.testnet.sui.io

# Optional: Seal Configuration
REACT_APP_SEAL_ENABLED=true
```

## 🚀 Deployment

### Current Status (Hackathon Version)

**Mock Implementation:**
- All storage operations use `localStorage` (mock Walrus)
- Walrus IDs are generated locally (format: `WAL-{timestamp}-{random}`)
- Content hashes are computed using SHA-256
- All blockchain operations are mocked for demo purposes

**Production Ready:**
- Code structure supports real Walrus integration
- All mock functions are clearly marked with `// TODO: Replace with real Walrus/Sui testnet`
- Ready for testnet integration post-hackathon

### Testnet Deployment (Future)

1. **Install Sui CLI**
   ```bash
   curl -sSfL https://suiup.mystenlabs.com/install | bash
   ```

2. **Switch to testnet**
   ```bash
   sui client switch --env testnet
   ```

3. **Get test tokens**
   ```bash
   sui client faucet
   ```

4. **Deploy smart contract** (when ready)
   ```bash
   cd contracts
   sui move build
   sui client publish --gas-budget 100000000
   ```

5. **Update `.env.local`**
   ```bash
   REACT_APP_PACKAGE_ID=0x...
   REACT_APP_WALRUS_RPC_URL=https://walrus-testnet-rpc.mystenlabs.com
   ```

## 🤖 AI Analysis

### Wellness Score Calculation

Weighted algorithm (0-100 scale):

- **Mood** (25%) - Based on mood score (1-10)
- **Sleep** (20%) - Hours + quality score
- **Exercise** (15%) - Duration + intensity
- **Stress** (20%) - Inverse of stress/anxiety levels
- **Mental Health** (20%) - Gratitude, challenges, stress management

**Status Levels:**
- 🟢 **Excellent** (80-100)
- 🔵 **Good** (60-79)
- 🟠 **Needs Attention** (40-59)
- 🔴 **Critical** (0-39)

### Health Risk Detection

Automated alerts for:

- ⚠️ **Sleep Deprivation** - < 6 hours detected
- ⚠️ **High Stress** - Stress level ≥ 8/10
- ⚠️ **High Anxiety** - Anxiety level ≥ 8/10
- ⚠️ **Sedentary Lifestyle** - No exercise recorded
- ⚠️ **Low Mood** - Mood score ≤ 3/10
- ⚠️ **Severe Symptoms** - Symptom severity ≥ 7/10

### Trend Analysis

- **Mood Trends** - Track mood patterns over time
- **Sleep Patterns** - Monitor sleep consistency
- **Stress Levels** - Identify stress spikes
- **Exercise Activity** - Track physical activity trends

**Trend Indicators:**
- 📈 **Improving** - Positive trend detected
- 📉 **Declining** - Negative trend detected
- ➡️ **Stable** - No significant change

### Personalized Recommendations

Priority-based suggestions:

- **High Priority** - Critical health risks
- **Medium Priority** - Important improvements
- **Low Priority** - Optimization tips

Categories:
- Sleep improvement strategies
- Stress management techniques
- Physical activity goals
- Nutrition & hydration
- Mental wellness support

## 📊 Data Flow

```
User Form Input
      ↓
Validate & Prepare Data
      ↓
Optional: Seal Encryption (AES)
      ↓
Store on Walrus (Mock: localStorage)
      ↓
Generate Walrus ID + Content Hash
      ↓
Record Hash for Verification (Mock)
      ↓
Run AI Analysis
      ↓
Display Results & Insights
      ↓
Show Recommendations
```

## 🔒 Privacy & Security

✅ **All data processing happens locally** on user's device  
✅ **No API calls** for sensitive health data  
✅ **Data encrypted** before storage (optional Seal encryption)  
✅ **Blockchain verification** ready for testnet  
✅ **User controls** their data completely  
✅ **Content hash** verification for data integrity

## 📚 Documentation

- [Setup Guide](./QUICK_START.md) - Quick start instructions
- [Test Guide](./TEST_GUIDE.md) - Testing instructions
- [Walrus Integration](./WALRUS_TESTNET_GUIDE.md) - Walrus testnet guide
- [Step 3 Guide](./step3Guide.md) - AI Analysis setup

## 🎮 Usage

### Create Entry

1. Navigate to **"📝 New Entry"** tab
2. Fill out wellness form:
   - Date
   - Mood (score + description)
   - Sleep (hours + quality)
   - Exercise (type, duration, intensity)
   - Mental health (stress, anxiety, gratitude)
   - Additional notes
3. **Optional:** Enable Seal encryption and set access key
4. Click **"💾 Store on Blockchain"**
5. Entry stored with Walrus ID ✓
6. View entry in entries list

### View Analysis

1. Navigate to **"🤖 AI Analysis"** tab
2. See **Overall Wellness Score** (circular display)
3. View **Health Risks** (if any detected)
4. Check **AI Insights** (positive messages, warnings)
5. Explore **Trends** (interactive charts)
6. Review **Recommendations** (personalized suggestions)

### Retrieve Entry

1. Copy **Walrus ID** from a saved entry
2. Paste into **"Enter Walrus ID"** field
3. Click **"🔍 Retrieve Entry"**
4. Entry data retrieved and displayed

## 🏆 Hackathon Info

**Track:** AI x Data  
**Prize Pool:** $105K  
**Deadline:** November 23, 2025  
**Event:** Haulout Hackathon

### Why This Project Fits the Track

✅ **Uses Walrus** for decentralized data storage  
✅ **Implements AI analysis** on health data (wellness scoring, risk detection)  
✅ **Data provenance tracking** on blockchain (ready for Sui testnet)  
✅ **Demonstrates privacy-first** architecture (local processing, encryption)  
✅ **Real-world healthcare use case** (wellness tracking, health insights)  
✅ **End-to-end pipeline** from data collection → storage → analysis → insights

### Current Implementation Status

**✅ Completed:**
- Full wellness form with all metrics
- Mock Walrus storage (localStorage-based)
- AI analysis engine (wellness score, risk detection, trends)
- UI/UX with modern design
- Encryption support (Seal/AES)
- Trend visualization
- Personalized recommendations

**🚧 Ready for Production:**
- Real Walrus testnet integration (code structure ready)
- Sui smart contract deployment (mock ready)
- On-chain data verification (hash storage ready)

**📝 Notes for Judges:**
- We prioritized working logic and end-to-end AI x Data pipeline for the hackathon deadline
- All blockchain operations are clearly mocked and marked for production integration
- We are ready for mainnet/testnet integration post-hackathon
- The AI analysis engine is fully functional and demonstrates real-world healthcare insights

## 👥 Team

- Your Name (@github_username)

## 📝 License

MIT License

## 🙏 Acknowledgments

- **Sui Network & Mysten Labs** - Blockchain infrastructure
- **Walrus Protocol** - Decentralized storage
- **Haulout Hackathon** - Event organizers
- **React Community** - Frontend framework

## 📞 Support

For issues or questions:

- 📧 **Email:** your_email@example.com
- 🐛 **GitHub Issues:** [Open an issue](https://github.com/YOUR_USERNAME/wellness-journal-haulout/issues)
- 📖 **Documentation:** Check existing docs in `/docs` folder

## 🔮 Future Work / On-chain Production Plan

### Phase 1: Testnet Integration
- [ ] Replace mock Walrus storage with real `WalrusClient.writeBlob()`
- [ ] Integrate Sui signer for on-chain transactions
- [ ] Deploy Move smart contract for data provenance
- [ ] Store Walrus IDs and content hashes on Sui blockchain

### Phase 2: Enhanced Features
- [ ] Multi-user support with wallet authentication
- [ ] Data sharing permissions
- [ ] Export/import functionality
- [ ] Advanced ML models for predictions

### Phase 3: Production
- [ ] Mainnet deployment
- [ ] Performance optimization
- [ ] Security audit
- [ ] User onboarding flow

---

**Built with ❤️ for Haulout Hackathon**

*Prioritizing working logic and end-to-end AI x Data pipeline. Ready for testnet integration post-hackathon.*
