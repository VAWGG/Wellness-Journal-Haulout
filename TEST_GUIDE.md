# 🚀 Hướng Dẫn Test App Wellness Journal

## 📋 Bước 1: Kiểm tra Node.js & npm

Mở terminal/PowerShell và kiểm tra:
```bash
node --version
npm --version
```

Nếu chưa có, cài đặt Node.js từ: https://nodejs.org/

## 📦 Bước 2: Cài đặt Dependencies

Trong thư mục project, chạy:
```bash
npm install
```

Lệnh này sẽ cài đặt:
- React & React DOM
- react-scripts
- @mysten/walrus
- @mysten/sui
- crypto-js

## 🏃 Bước 3: Chạy Development Server

```bash
npm start
```

App sẽ tự động mở tại: **http://localhost:3000**

Nếu không tự mở, mở trình duyệt và vào: `http://localhost:3000`

## ✅ Bước 4: Test các tính năng

### Test Form (Tab "📝 New Entry")

1. **Điền Form:**
   - Chọn date
   - Mood: Chọn mood (VD: "Happy"), score: 7/10
   - Sleep: 8 hours, quality: 7/10
   - Exercise: 30 minutes, moderate intensity
   - Stress Level: 4/10
   - Anxiety Level: 3/10
   - Gratitude: "Grateful for health"
   - Notes: "Feeling good today"

2. **Test Encryption (Optional):**
   - Check "Enable Seal Encryption"
   - Nhập access key (VD: "mykey123")

3. **Submit:**
   - Click "💾 Store on Blockchain"
   - Đợi message success
   - Xem entry được thêm vào list

### Test AI Analysis (Tab "🤖 AI Analysis")

1. **Xem Overall Wellness Score:**
   - Score hiển thị 0-100
   - Status badge (Excellent/Good/Needs Attention/Critical)
   - Breakdown bars cho từng metric

2. **Xem Health Risks:**
   - Tab "⚠️ Risks"
   - Kiểm tra các risks được detect
   - Đọc recommendations

3. **Xem AI Insights:**
   - Tab "💡 Insights"
   - Xem positive messages và warnings
   - Pattern recognition

4. **Xem Trends:**
   - Tab "📈 Trends"
   - Charts cho Mood, Sleep, Stress, Exercise
   - Trend indicators (📈 Improving, 📉 Declining, ➡️ Stable)

5. **Xem Recommendations:**
   - Tab "🎯 Recommendations"
   - Personalized suggestions
   - Priority badges (High/Medium/Low)

### Test với nhiều entries

1. Tạo thêm 2-3 entries nữa với các giá trị khác nhau
2. Vào AI Analysis tab
3. Chọn entry khác từ dropdown (nếu có nhiều entries)
4. Xem trends update với nhiều data points

## 🧪 Test Cases

### Test Case 1: High Wellness Score
- Mood: 9/10
- Sleep: 8 hours, quality: 8/10
- Exercise: 45 minutes
- Stress: 2/10
- Anxiety: 2/10
- **Expected:** Score 80+, Status "Excellent"

### Test Case 2: Low Wellness Score
- Mood: 3/10
- Sleep: 4 hours, quality: 3/10
- Exercise: 0 minutes
- Stress: 9/10
- Anxiety: 8/10
- **Expected:** Score < 40, Status "Critical", Multiple risks

### Test Case 3: Sleep Deprivation
- Sleep: 5 hours
- **Expected:** Sleep deprivation risk alert

### Test Case 4: High Stress
- Stress: 9/10
- **Expected:** High stress risk alert

### Test Case 5: Sedentary Lifestyle
- Exercise: 0 minutes
- **Expected:** Sedentary lifestyle warning

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng?
```bash
# Windows PowerShell
$env:PORT=3001
npm start

# Hoặc kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### npm install bị lỗi?
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json

# Cài lại
npm install
```

### Module not found errors?
- Đảm bảo đã chạy `npm install`
- Kiểm tra các imports trong code
- Restart dev server

### Walrus connection errors?
- Check `.env.local` file có đúng config không
- Test với testnet URL first
- Xem console logs để debug

## 📸 Expected UI

### Form Tab:
- Gradient purple background
- White form sections
- Sliders cho scores
- Submit button với gradient

### Analysis Tab:
- Circular score display
- Color-coded status badges
- Tab navigation
- Interactive charts
- Recommendation cards

## ✅ Checklist Test

- [ ] App mở được tại localhost:3000
- [ ] Form submit được entry
- [ ] Entry hiển thị trong entries list
- [ ] AI Analysis tab load được
- [ ] Wellness score hiển thị đúng
- [ ] Risks được detect
- [ ] Insights hiển thị
- [ ] Trends charts render
- [ ] Recommendations hiển thị
- [ ] Navigation giữa tabs hoạt động
- [ ] Multiple entries hoạt động
- [ ] Encryption option hoạt động (nếu test)

## 🎉 Done!

Nếu tất cả test cases pass, app đã sẵn sàng! 🚀

---

**Quick Start Command:**
```bash
npm install && npm start
```

**Hoặc nếu dùng PowerShell:**
```powershell
npm install; npm start
```



