# Products API Documentation (Updated for Frontend)

## ✅ Các API đã được cập nhật để phù hợp với Frontend

### Authentication
Tất cả các API yêu cầu JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

StoreId sẽ được tự động lấy từ userId trong JWT token, không cần truyền vào path nữa.

---

## 📋 **1. GET Products List** ✅ Đã phù hợp

**Endpoint:** `GET /api/products`

**Query Parameters:**
- `search` (optional): Tìm kiếm theo title, description, sku
- `status` (optional): Filter theo status (`Available`, `Hidden`, `Draft`)
- `page` (optional, default: 1): Số trang
- `limit` (optional, default: 10): Số items mỗi trang

**Request Example:**
```bash
GET /api/products?search=laptop&status=Available&page=1&limit=10
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

**Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "title": "Laptop Dell",
      "description": "Description here",
      "price": 1500,
      "sku": "LAP-001",
      "status": "Available",
      "images": ["url1", "url2"],
      "is_hidden": false,
      "created_at": "2025-11-08T...",
      "updated_at": "2025-11-08T..."
    }
  ],
  "total": 50,
  "page": 1,
  "totalPages": 5,
  "limit": 10
}
```

---

## 📋 **2. GET Product by ID** ✅ Đã phù hợp

**Endpoint:** `GET /api/products/:productId`

**Request Example:**
```bash
GET /api/products/673e123456789abcd
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

**Response:**
```json
{
  "product": {
    "_id": "product_id",
    "title": "Laptop Dell",
    "description": "Description here",
    "price": 1500,
    "sku": "LAP-001",
    "status": "Available",
    "images": ["url1", "url2"],
    "store_id": "store_id",
    "is_hidden": false
  },
  "inventory": {
    "_id": "inventory_id",
    "product_id": "product_id",
    "quantity": 100,
    "location": "Warehouse A"
  }
}
```

---

## 📋 **3. CREATE Product** ✅ Đã phù hợp

**Endpoint:** `POST /api/products`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "Product Name",
  "description": "Product description",
  "price": 299.99,
  "sku": "PROD-001",
  "status": "Available",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "category": "Electronics",
  "initial_quantity": 50,
  "location": "Warehouse A"
}
```

**Response:**
```json
{
  "product": {
    "_id": "product_id",
    "title": "Product Name",
    "store_id": "store_id",
    "status": "Available",
    "is_hidden": false,
    ...
  },
  "inventory": {
    "_id": "inventory_id",
    "product_id": "product_id",
    "quantity": 50,
    "location": "Warehouse A"
  }
}
```

---

## 📋 **4. UPDATE Product** ✅ Đã phù hợp

**Endpoint:** `PUT /api/products/:productId`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "Updated Product Name",
  "description": "Updated description",
  "price": 349.99,
  "status": "Available",
  "images": ["https://example.com/new-image.jpg"]
}
```

**Response:**
```json
{
  "_id": "product_id",
  "title": "Updated Product Name",
  "price": 349.99,
  "updated_at": "2025-11-08T..."
}
```

---

## 📋 **5. UPDATE Product Status** ✅ Đã phù hợp

**Endpoint:** `PATCH /api/products/:productId/status`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "status": "Hidden"
}
```

**Allowed Status Values:**
- `"Available"` - Sản phẩm hiển thị và có thể mua
- `"Hidden"` - Sản phẩm bị ẩn
- `"Draft"` - Bản nháp

**Response:**
```json
{
  "message": "Product status updated successfully",
  "product": {
    "_id": "product_id",
    "title": "Product Name",
    "status": "Hidden",
    "is_hidden": true,
    "updated_at": "2025-11-08T..."
  }
}
```

---

## 📋 **6. DELETE Product** ✅ Đã phù hợp

**Endpoint:** `DELETE /api/products/:productId`

**Request Example:**
```bash
DELETE /api/products/673e123456789abcd
Headers: {
  "Authorization": "Bearer eyJhbGc..."
}
```

**Response:**
```json
{
  "message": "Product and associated inventory deleted successfully"
}
```

---

## 📋 **7. UPLOAD Image** ✅ Đã thêm

**Endpoint:** `POST /api/products/upload-image`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `image`: File (jpeg, jpg, png, gif, webp)
- Max size: 5MB

**Request Example:**
```javascript
const formData = new FormData();
formData.append('image', file);

fetch('/api/products/upload-image', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token
  },
  body: formData
});
```

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "url": "/uploads/products/image-1699445678901-123456789.jpg",
  "imageId": "image-1699445678901-123456789",
  "fullUrl": "http://localhost:3000/uploads/products/image-1699445678901-123456789.jpg"
}
```

---

## 📋 **8. SAVE DRAFT** ✅ Đã thêm

**Endpoint:** `POST /api/products/draft`

**Content-Type:** `application/json`

**Request Body:**
```json
{
  "title": "Draft Product",
  "description": "This is a draft",
  "price": 99.99,
  "images": ["https://example.com/image.jpg"]
}
```

**Response:**
```json
{
  "message": "Draft saved successfully",
  "product": {
    "_id": "product_id",
    "title": "Draft Product",
    "status": "Draft",
    "is_hidden": true,
    "created_at": "2025-11-08T..."
  }
}
```

---

## 🔄 Old API Routes (Backward Compatibility)

Các routes cũ vẫn hoạt động nhưng **không khuyến khích** sử dụng:

- `POST /api/products/:storeId/create` (multipart)
- `GET /api/products/:storeId/list`
- `GET /api/products/:storeId/:productId`
- `PUT /api/products/:storeId/:productId` (multipart)
- `PATCH /api/products/:storeId/:productId/hide` (toggle)
- `DELETE /api/products/:storeId/:productId`

---

## ⚠️ Error Responses

**401 Unauthorized:**
```json
{
  "message": "Access denied, no token provided"
}
```

**403 Forbidden:**
```json
{
  "message": "You do not have permission to access this product"
}
```

**404 Not Found:**
```json
{
  "message": "Product not found"
}
```

**400 Bad Request:**
```json
{
  "message": "Error creating product",
  "error": "Validation error message"
}
```

---

## 📝 Notes

1. **StoreId tự động:** Không cần truyền storeId, backend sẽ tự lấy từ JWT token
2. **JSON Support:** Tất cả APIs đều hỗ trợ JSON body, không bắt buộc multipart
3. **Image URLs:** Có thể truyền image URLs trực tiếp hoặc upload riêng qua `/upload-image`
4. **Pagination:** Default page=1, limit=10
5. **Status Values:** "Available", "Hidden", "Draft"
6. **Filtering:** Search hỗ trợ tìm theo title, description, SKU

---

## 🧪 Testing với Postman/Thunder Client

### 1. Login để lấy token:
```bash
POST http://localhost:3000/api/auth/login
Body: {
  "email": "seller@example.com",
  "password": "password123"
}
```

### 2. Tạo product mới:
```bash
POST http://localhost:3000/api/products
Headers: {
  "Authorization": "Bearer YOUR_TOKEN",
  "Content-Type": "application/json"
}
Body: {
  "title": "Test Product",
  "price": 99.99,
  "sku": "TEST-001",
  "status": "Available"
}
```

### 3. Get all products:
```bash
GET http://localhost:3000/api/products?page=1&limit=10
Headers: {
  "Authorization": "Bearer YOUR_TOKEN"
}
```

---

## ✅ Summary: Frontend Requirements vs Backend Implementation

| Requirement | Status | Endpoint |
|------------|--------|----------|
| GET Products List với pagination | ✅ | GET /api/products?search=&status=&page=&limit= |
| GET Product by ID | ✅ | GET /api/products/:productId |
| CREATE Product (JSON) | ✅ | POST /api/products |
| UPDATE Product (JSON) | ✅ | PUT /api/products/:productId |
| UPDATE Product Status | ✅ | PATCH /api/products/:productId/status |
| DELETE Product | ✅ | DELETE /api/products/:productId |
| UPLOAD Image | ✅ | POST /api/products/upload-image |
| SAVE DRAFT | ✅ | POST /api/products/draft |

**Kết luận:** 8/8 API requirements đã được implement! ✅
