# 🟢 Hướng Dẫn Test Walrus Testnet Integration

## ✅ Đã Cập Nhật

App đã được cập nhật để kết nối với **Walrus Testnet thật**!

### Thay đổi chính:
1. ✅ Dùng `WalrusClient` với RPC URL testnet
2. ✅ Dùng `uploadBlob()` và `readBlob()` API thật
3. ✅ Lấy `certifiedBlobId` và `contentHash` từ response
4. ✅ UI hiển thị Walrus ID và Content Hash đầy đủ
5. ✅ Copy button cho Walrus ID

## 🚀 Cách Test

### Bước 1: Đảm bảo Dependencies đã cài
```bash
npm install
```

### Bước 2: Kiểm tra Environment Variables
File `.env.local` (nếu có) hoặc dùng default:
```
REACT_APP_WALRUS_RPC_URL=https://walrus-testnet-rpc.mystenlabs.com
```

### Bước 3: Chạy App
```bash
npm start
```

### Bước 4: Test Store Entry

1. **Điền Form:**
   - Chọn date
   - Điền mood, sleep, exercise, stress, etc.
   - (Optional) Bật Seal Encryption nếu muốn

2. **Click "💾 Store on Blockchain"**

3. **Kiểm tra Console:**
   - Sẽ thấy: `🔗 Connecting to Walrus Testnet`
   - Sẽ thấy: `📤 Uploading to Walrus Testnet...`
   - Sẽ thấy: `✅ Successfully stored on Walrus Testnet!`

4. **Kiểm tra Success Message:**
   - Hiển thị: `✅ Entry stored on Walrus Testnet!`
   - Hiển thị: `Walrus ID: 0x...` (ID thật từ testnet)
   - Hiển thị: `Content Hash: ...`

5. **Kiểm tra Entry Card:**
   - Walrus ID đầy đủ
   - Content Hash
   - Badge "🟢 Walrus Testnet"
   - Button "📋 Copy" để copy Walrus ID

### Bước 5: Test Retrieve Entry

1. **Copy Walrus ID** từ entry vừa tạo (click Copy button)

2. **Paste vào field "Enter Walrus ID"**

3. **Click "🔍 Retrieve Entry"**

4. **Kiểm tra Console:**
   - Sẽ thấy: `📥 Retrieving from Walrus Testnet...`
   - Sẽ thấy: `✅ Successfully retrieved from Walrus Testnet!`

5. **Kiểm tra Entry:**
   - Data được fetch về đúng
   - Hiển thị trong entries list

## 🔍 Kiểm Tra Kết Nối

### Console Logs bạn sẽ thấy:

**Khi Store:**
```
🔗 Connecting to Walrus Testnet: https://walrus-testnet-rpc.mystenlabs.com
📤 Uploading to Walrus Testnet... {size: 1234, encrypted: false, ...}
✅ Successfully stored on Walrus Testnet! {walrusId: "0x...", contentHash: "..."}
```

**Khi Retrieve:**
```
📥 Retrieving from Walrus Testnet... {walrusId: "0x..."}
✅ Successfully retrieved from Walrus Testnet!
```

## ⚠️ Troubleshooting

### Lỗi: "Walrus upload failed"
- **Kiểm tra internet connection**
- **Kiểm tra RPC URL đúng:** `https://walrus-testnet-rpc.mystenlabs.com`
- **Xem console logs** để biết lỗi chi tiết

### Lỗi: "Failed to retrieve"
- **Kiểm tra Walrus ID đúng** (copy từ entry đã lưu)
- **Kiểm tra internet connection**
- **Xem console logs** để biết lỗi chi tiết

### Network Error
- Kiểm tra firewall không chặn
- Thử refresh page
- Kiểm tra RPC endpoint có hoạt động không

## 📋 Checklist Test

- [ ] App compile thành công
- [ ] Console hiển thị "Connecting to Walrus Testnet"
- [ ] Store entry thành công → Nhận Walrus ID thật
- [ ] Success message hiển thị Walrus ID và Content Hash
- [ ] Entry card hiển thị đầy đủ thông tin
- [ ] Copy button hoạt động
- [ ] Retrieve entry thành công với Walrus ID
- [ ] Data được fetch về đúng

## 🎯 Expected Results

### Sau khi Store thành công:
- ✅ Walrus ID: `0x...` (ID thật từ testnet, có thể dùng để retrieve)
- ✅ Content Hash: `...` (hash để verify integrity)
- ✅ Entry được lưu trên Walrus Testnet
- ✅ Có thể retrieve từ bất kỳ đâu với Walrus ID

### Sau khi Retrieve thành công:
- ✅ Data được fetch về từ Walrus Testnet
- ✅ Hiển thị đúng thông tin entry
- ✅ Có thể verify integrity với Content Hash

## 🚀 Next Steps (Optional)

1. **Lưu Walrus ID lên Sui Smart Contract** (cho provenance)
2. **Tích hợp Sui Wallet** (cho authentication)
3. **Deploy lên production** với mainnet

---

**Happy Testing! 🎉**

