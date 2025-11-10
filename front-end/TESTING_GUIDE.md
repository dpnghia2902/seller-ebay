# 🎨 HƯỚNG DẪN KIỂM TRA GIAO DIỆN FRONTEND

## 📋 Cách kiểm tra UI mà không cần Login

### Bước 1: Bật chế độ test UI
Mở file: `src/App.jsx`

Tìm dòng này (khoảng dòng 10):
```javascript
const [isAuthenticated, setIsAuthenticated] = useState(true);
```

- **Đặt `true`** → Bỏ qua login, vào thẳng Dashboard để test UI
- **Đặt `false`** → Hiển thị trang Login

**⚠️ LƯU Ý**: Hiện tại đã đặt là `true` sẵn để test UI!

### Bước 2: Chạy frontend
Mở PowerShell trong thư mục `front-end`:
```powershell
# Di chuyển vào thư mục front-end
cd d:\FFShop\seller-ebay\front-end

# Cài dependencies (chỉ lần đầu)
npm install

# Chạy dev server
npm run dev
```

### Bước 3: Mở trình duyệt
Mở: `http://localhost:5173` (hoặc port được hiển thị trong terminal)

Bạn sẽ thấy giao diện Dashboard với sidebar màu cam bên trái!

---

## 🎯 Các trang đã hoàn thành

### ✅ 1. Dashboard (Trang chủ)
- Biểu đồ doanh số
- Thống kê tổng quan
- Bảng sản phẩm bán chạy

### ✅ 2. Orders (Đơn hàng)
- Danh sách đơn hàng
- Search và filter theo status
- Phân trang
- Hiển thị trạng thái: Pending, Packaging, Shipped, Delivered

### ✅ 3. Products (Sản phẩm)
- Quản lý sản phẩm
- Edit/Delete buttons
- Status badges
- Nút Add floating

### 🔄 4. Inventory (Đang phát triển)

### 🔄 5. Profile (Đang phát triển)

---

## 🔧 Chức năng Sidebar

Thanh sidebar bên trái có thể:
- ✅ Click để chuyển trang
- ✅ Highlight trang hiện tại
- ✅ Thu gọn/mở rộng (nút hamburger)
- ✅ Responsive trên mobile

---

## 🌐 API Frontend (Đã tạo sẵn trong `src/api/client.js`)

### Dashboard APIs
```javascript
getTopProducts()      // GET /api/dashboard/top-products
getSummary()          // GET /api/dashboard/summary
getMonthlySales()     // GET /api/dashboard/sales-monthly
```

### Orders APIs
```javascript
getOrders(params)                  // GET /api/orders
getOrderById(orderId)              // GET /api/orders/:id
updateOrderStatus(orderId, status) // PUT /api/orders/:id/status
```

### 💡 Mock Data
**Tất cả các trang đều có mock data sẵn**, nên bạn có thể xem UI ngay cả khi backend chưa chạy!

- Nếu API thành công → Dùng data từ server
- Nếu API lỗi → Tự động dùng mock data

---

## 📱 Responsive Testing

### Desktop
- Sidebar full width (280px)
- Hiển thị đầy đủ thông tin

### Tablet (< 1024px)
- Sidebar có thể ẩn/hiện
- Bảng responsive

### Mobile (< 768px)
- Sidebar ẩn mặc định
- Một số cột bị ẩn để tối ưu
- Touch-friendly buttons

---

## 🎨 Màu sắc Theme

### Primary Colors
- Orange: `#e67e22` (Sidebar, buttons)
- Orange Dark: `#d35400` (Hover states)

### Status Colors
- Shipped/Delivered: `#10b981` (Green)
- Packaging: `#f59e0b` (Yellow/Orange)
- Pending: `#94a3b8` (Gray)
- Hidden: `#e5e7eb` (Light gray)

### Neutral Colors
- Background: `#f8fafc`
- Text: `#1e293b`
- Border: `#e2e8f0`

---

## 🐛 Troubleshooting

### Lỗi: "Cannot find module" hoặc "Module not found"
```powershell
# Xóa node_modules và cài lại
Remove-Item -Recurse -Force node_modules
npm install
```

### Lỗi: Port đã được sử dụng
```powershell
# Đổi port sang 3000
npm run dev -- --port 3000
```

### Trang hiện Login thay vì Dashboard
- Mở `src/App.jsx`
- Đổi `setIsAuthenticated(false)` → `setIsAuthenticated(true)`

### API không hoạt động (Không sao!)
- ✅ **Component tự động dùng mock data** nếu API lỗi
- ✅ Bạn vẫn xem được đầy đủ UI
- Backend không cần chạy để test giao diện

---

## 📝 Tips & Shortcuts

### Kiểm tra UI nhanh
```javascript
// Trong App.jsx
const [isAuthenticated, setIsAuthenticated] = useState(true); // ← Đặt true
```

### Chuyển trang
Chỉ cần click vào sidebar:
- 📊 Dashboard → Trang chủ với biểu đồ
- 🛒 Orders → Danh sách đơn hàng  
- 📦 Products → Quản lý sản phẩm
- 🏷️ Inventory → Coming soon
- 👤 Profile → Coming soon

### Hot Reload
- Sửa code → Tự động reload
- Không cần restart server
- Mở Console (F12) để xem log/errors

### Xem trên Mobile
```
# Lấy IP máy tính
ipconfig

# Mở trên điện thoại
http://192.168.x.x:5173
```

---

## 🎯 TÓM TẮT: Cách kiểm tra nhanh nhất

1. **Mở PowerShell** trong thư mục `front-end`
2. **Chạy**: `npm run dev`
3. **Mở trình duyệt**: `http://localhost:5173`
4. **Thấy Dashboard** → Thành công! 🎉
5. **Click sidebar** để xem các trang khác

**Không cần backend**, tất cả có mock data sẵn!

---

## 🚀 Đã hoàn thành

### ✅ Frontend
- [x] Layout với Sidebar navigation
- [x] Dashboard page (biểu đồ + thống kê)
- [x] Orders page (danh sách đơn hàng)
- [x] Products page (quản lý sản phẩm)
- [x] Responsive design (mobile/tablet/desktop)
- [x] Mock data cho tất cả trang
- [x] API client functions

### 📦 Files đã tạo
```
front-end/src/
├── App.jsx (Navigation & routing)
├── api/
│   └── client.js (API functions)
├── components/
│   ├── Layout/
│   │   ├── Layout.jsx
│   │   └── Layout.css
│   ├── Dashboard/
│   │   ├── DashboardContent.jsx
│   │   └── DashboardContent.css
│   ├── Orders/
│   │   ├── Orders.jsx
│   │   └── Orders.css
│   └── Products/
│       ├── Products.jsx
│       └── Products.css
└── TESTING_GUIDE.md (File này!)
```

---

**🎨 Giờ bạn có thể test UI hoàn chỉnh mà không cần backend!**
