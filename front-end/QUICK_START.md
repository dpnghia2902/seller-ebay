# 🚀 CÁCH CHẠY FRONTEND

## Bước 1: Mở Terminal
```powershell
cd d:\FFShop\seller-ebay\front-end
```

## Bước 2: Cài packages (lần đầu)
```powershell
npm install
```

## Bước 3: Chạy
```powershell
npm run dev
```

## Bước 4: Mở trình duyệt
```
http://localhost:5173
```

---

## ✅ Đã có gì:
- ✅ **Dashboard** - Trang chủ với biểu đồ
- ✅ **Orders** - Danh sách đơn hàng (giống ảnh bạn gửi)
- ✅ **Products** - Quản lý sản phẩm
- ✅ **Sidebar** có thể click để chuyển trang
- ✅ **Mock data** sẵn, không cần backend

---

## 🎯 Để bỏ qua Login khi test UI:

Mở `src/App.jsx`, dòng 10:
```javascript
const [isAuthenticated, setIsAuthenticated] = useState(true); // ← Đặt true
```

---

Xem chi tiết: [TESTING_GUIDE.md](./TESTING_GUIDE.md)
