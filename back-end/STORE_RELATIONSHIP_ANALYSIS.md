# Báo cáo: Mối quan hệ các API với bảng Store

## 📊 TỔNG QUAN

Tất cả các API đã implement đều có **mối quan hệ trực tiếp hoặc gián tiếp** với bảng **Store**.

---

## 🔗 CHI TIẾT MỐI QUAN HỆ

### 1. **PRODUCT APIs** - **Liên quan TRỰC TIẾP** ✅

#### Mối quan hệ:
- **Product Model** có field `store_id` (ObjectId) tham chiếu đến Store
- Mỗi product **BẮT BUỘC** thuộc về một Store

#### Endpoints và cách sử dụng Store:

**`POST /api/products/:storeId`**
```javascript
// Verify store exists
const store = await Store.findById(storeId);
if (!store) {
  return res.status(404).json({ message: 'Store not found' });
}

// Link product to store
const productData = {
  ...req.body,
  store_id: storeId,  // ⬅️ LIÊN KẾT VỚI STORE
  images: images
};
```

**`GET /api/products/:storeId`**
```javascript
// Verify store exists
const store = await Store.findById(storeId);

// Only get products for THIS store
const products = await Product.find({ store_id: storeId });  // ⬅️ LỌC THEO STORE
```

**`GET /api/products/:storeId/:productId`**
```javascript
// Find product that belongs to this store
const product = await Product.findOne({ 
  _id: productId, 
  store_id: storeId  // ⬅️ ĐẢM BẢO PRODUCT THUỘC STORE NÀY
});
```

**`PUT /api/products/:storeId/:productId`**
```javascript
// Verify product belongs to store before updating
const product = await Product.findOne({ 
  _id: productId, 
  store_id: storeId  // ⬅️ KIỂM TRA QUYỀN SỞ HỮU
});
```

**`PATCH /api/products/:storeId/:productId/hide`**
```javascript
// Same verification as PUT
const product = await Product.findOne({ 
  _id: productId, 
  store_id: storeId 
});
```

**`DELETE /api/products/:storeId/:productId`**
```javascript
// Verify before deleting
const product = await Product.findOne({ 
  _id: productId, 
  store_id: storeId 
});
```

---

### 2. **INVENTORY APIs** - **Liên quan GIÁN TIẾP** ⚠️

#### Mối quan hệ:
- **Inventory Model** KHÔNG có field `store_id` trực tiếp
- Nhưng Inventory tham chiếu đến **Product** (`product_id`)
- Product có `store_id` → **Inventory liên quan đến Store qua Product**

#### Chuỗi quan hệ:
```
Inventory → product_id → Product → store_id → Store
```

#### Endpoints và cách sử dụng Store:

**`GET /api/inventory/:storeId`**
```javascript
// 1. Verify store exists
const store = await Store.findById(storeId);

// 2. Get all products for THIS store
const products = await Product.find({ store_id: storeId });  // ⬅️ LỌC THEO STORE
const productIds = products.map(p => p._id);

// 3. Get inventory for those products only
const inventory = await Inventory.find({ 
  product_id: { $in: productIds }  // ⬅️ CHỈ LẤY INVENTORY CỦA STORE NÀY
});
```

**`PATCH /api/inventory/:inventoryId`**
```javascript
// Cập nhật inventory by ID
// KHÔNG verify store trực tiếp trong API này
// ⚠️ CẦN CẢI THIỆN: Nên verify inventory thuộc về store của user
```

**`POST /api/inventory/:storeId/:productId/stock-adjust`**
```javascript
// Verify product belongs to store
const product = await Product.findOne({ 
  _id: productId, 
  store_id: storeId  // ⬅️ ĐẢM BẢO PRODUCT THUỘC STORE
});

// Then adjust inventory for that product
let inventory = await Inventory.findOne({ product_id: productId });
```

---

### 3. **DASHBOARD APIs** - **Liên quan GIÁN TIẾP** ⚠️⚠️

#### Mối quan hệ:
- **Dashboard APIs** query từ **Order Model**
- Order Model có field `store_id` (ObjectId) tham chiếu đến Store
- Nhưng **HIỆN TẠI các Dashboard APIs KHÔNG lọc theo Store**

#### ⚠️ VẤN ĐỀ QUAN TRỌNG:

**`GET /api/dashboard/summary`**
```javascript
// ❌ KHÔNG LỌC THEO STORE
const totalSales = await Order.countDocuments({
  status: { $in: ['delivered'] },
  created_at: { $gte: startOfMonth, $lte: endOfMonth }
  // ⚠️ MISSING: store_id filter
});

// Kết quả: Lấy TẤT CẢ orders của TẤT CẢ stores
```

**`GET /api/dashboard/sales-monthly`**
```javascript
// ❌ KHÔNG LỌC THEO STORE
const monthlySales = await Order.aggregate([
  {
    $match: {
      status: { $in: ['delivered'] },
      created_at: { $gte: startDate }
      // ⚠️ MISSING: store_id filter
    }
  }
]);

// Kết quả: Doanh thu của TẤT CẢ stores
```

**`GET /api/dashboard/top-products`**
```javascript
// ❌ KHÔNG LỌC THEO STORE
const topProductsData = await Order.aggregate([
  {
    $match: {
      status: { $in: ['delivered'] }
      // ⚠️ MISSING: store_id filter
    }
  }
]);

// Kết quả: Top products từ TẤT CẢ stores
```

---

## 🔧 KHUYẾN NGHỊ CẢI THIỆN

### 1. **Dashboard APIs CẦN bổ sung storeId**

Thay đổi endpoints từ:
```
GET /api/dashboard/summary
GET /api/dashboard/sales-monthly
GET /api/dashboard/top-products
```

Thành:
```
GET /api/dashboard/:storeId/summary
GET /api/dashboard/:storeId/sales-monthly
GET /api/dashboard/:storeId/top-products
```

Hoặc sử dụng query parameter:
```
GET /api/dashboard/summary?storeId=xxx
GET /api/dashboard/sales-monthly?storeId=xxx
GET /api/dashboard/top-products?storeId=xxx
```

### 2. **Inventory Update API cần verify store ownership**

Trong `PATCH /api/inventory/:inventoryId`, cần thêm:
```javascript
// Get inventory with product populated
const inventory = await Inventory.findById(inventoryId)
  .populate('product_id');

// Verify product belongs to user's store
if (inventory.product_id.store_id.toString() !== userStoreId) {
  return res.status(403).json({ message: 'Unauthorized' });
}
```

### 3. **Thêm Authentication & Authorization middleware**

Tất cả APIs nên có:
```javascript
// Middleware to verify user owns the store
const verifyStoreOwnership = async (req, res, next) => {
  const { storeId } = req.params;
  const userId = req.user.id; // from JWT token
  
  const store = await Store.findOne({ _id: storeId, owner_id: userId });
  if (!store) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  next();
};

// Apply to routes
router.get('/:storeId/products', verifyStoreOwnership, getStoreProducts);
```

---

## 📊 BẢNG TÓNG KẾT

| API Group | Số APIs | Liên quan Store | Mức độ | Cần cải thiện |
|-----------|---------|-----------------|---------|---------------|
| **Products** | 6 | ✅ Trực tiếp | Tốt | ⚠️ Cần auth |
| **Inventory** | 3 | ⚠️ Gián tiếp | Trung bình | ⚠️⚠️ Cần verify store |
| **Dashboard** | 3 | ❌ Không filter | Yếu | ⚠️⚠️⚠️ CẦN bổ sung storeId |
| **TỔNG** | **12** | **Tất cả có liên quan** | | |

---

## 🎯 KẾT LUẬN

### ✅ Có liên quan:
- **100% APIs đã làm đều có liên quan đến Store** (trực tiếp hoặc gián tiếp)

### ⚠️ Vấn đề:
1. **Dashboard APIs** không filter theo Store → Lấy data của TẤT CẢ stores
2. **Inventory Update** không verify store ownership → Có thể update inventory của store khác
3. **Thiếu Authentication** → Chưa verify user ownership

### 🔧 Giải pháp:
1. **Ưu tiên cao**: Thêm `storeId` filter vào Dashboard APIs
2. **Ưu tiên cao**: Thêm store verification vào Inventory Update
3. **Ưu tiên trung bình**: Implement authentication middleware cho tất cả APIs
4. **Ưu tiên thấp**: Optimize queries với indexes

---

**Ngày tạo:** November 1, 2025  
**Tác giả:** GitHub Copilot
