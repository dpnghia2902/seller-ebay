# Product APIs Documentation

## 📋 Tóm tắt thay đổi

Backend đã được cập nhật để tương thích 100% với Frontend requirements.

### ✅ Các API mới (Frontend Compatible)

Tất cả APIs mới đều:
- **Không cần** `storeId` trong path (tự động lấy từ JWT token)
- **Yêu cầu JWT** authentication (Bearer token)
- **Hỗ trợ JSON** body (không bắt buộc multipart/form-data)
- **Response format** chuẩn theo frontend requirements

---

## 🔐 Authentication

Tất cả APIs đều yêu cầu JWT token trong header:

```http
Authorization: Bearer <your-jwt-token>
```

StoreId được tự động lấy từ `userId` trong JWT token.

---

## 📝 API Endpoints

### 1. GET Products List - ✅ Phù hợp

**Endpoint:** `GET /api/products?search=&status=&page=&limit=`

**Query Parameters:**
- `search` (optional): Tìm kiếm theo title, description, hoặc sku
- `status` (optional): Filter theo status (`Available` hoặc `Hidden`)
- `page` (optional, default: 1): Số trang
- `limit` (optional, default: 10): Số lượng items mỗi trang

**Response:**
```json
{
  "products": [
    {
      "_id": "product_id",
      "title": "Product Title",
      "description": "Description",
      "price": 100,
      "sku": "SKU123",
      "images": ["url1", "url2"],
      "is_hidden": false,
      "store_id": "store_id",
      "created_at": "date",
      "updated_at": "date"
    }
  ],
  "total": 100,
  "page": 1,
  "totalPages": 10
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/products?search=laptop&status=Available&page=1&limit=10" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### 2. GET Product by ID - ✅ Phù hợp

**Endpoint:** `GET /api/products/:productId`

**Response:**
```json
{
  "_id": "product_id",
  "title": "Product Title",
  "description": "Description",
  "price": 100,
  "sku": "SKU123",
  "images": ["url1", "url2"],
  "is_hidden": false,
  "store_id": "store_id",
  "inventory": {
    "_id": "inventory_id",
    "product_id": "product_id",
    "quantity": 50,
    "location": "Warehouse A"
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/products/67890abc" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### 3. CREATE Product - ✅ Phù hợp

**Endpoint:** `POST /api/products`

**Body (JSON):**
```json
{
  "title": "Product Title",
  "description": "Product Description",
  "price": 100,
  "sku": "SKU123",
  "status": "Available",
  "image_url": "https://example.com/image.jpg",
  "images": ["url1", "url2"],
  "initial_quantity": 50
}
```

**Notes:**
- `status`: `"Available"` (is_hidden=false) hoặc `"Hidden"` (is_hidden=true)
- Có thể dùng `image_url` (single) hoặc `images` (array)
- `initial_quantity`: Số lượng khởi tạo cho inventory (default: 0)

**Response:**
```json
{
  "_id": "product_id",
  "title": "Product Title",
  "description": "Product Description",
  "price": 100,
  "sku": "SKU123",
  "images": ["url"],
  "is_hidden": false,
  "store_id": "store_id",
  "inventory": {
    "_id": "inventory_id",
    "product_id": "product_id",
    "quantity": 50
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop Dell XPS 15",
    "description": "High performance laptop",
    "price": 1500,
    "sku": "DELL-XPS-15",
    "status": "Available",
    "image_url": "https://example.com/laptop.jpg",
    "initial_quantity": 10
  }'
```

---

### 4. UPDATE Product - ✅ Phù hợp

**Endpoint:** `PUT /api/products/:productId`

**Body (JSON):**
```json
{
  "title": "Updated Title",
  "description": "Updated Description",
  "price": 150,
  "sku": "SKU456",
  "status": "Hidden",
  "image_url": "https://example.com/new-image.jpg"
}
```

**Notes:**
- Chỉ cần gửi các fields cần update
- `status`: `"Available"` hoặc `"Hidden"`

**Response:**
```json
{
  "_id": "product_id",
  "title": "Updated Title",
  "description": "Updated Description",
  "price": 150,
  "is_hidden": true,
  "updated_at": "new_date"
}
```

**Example:**
```bash
curl -X PUT "http://localhost:3000/api/products/67890abc" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Laptop Dell XPS 15 - Updated",
    "price": 1600,
    "status": "Available"
  }'
```

---

### 5. UPDATE Product Status - ✅ Phù hợp

**Endpoint:** `PATCH /api/products/:productId/status`

**Body (JSON):**
```json
{
  "status": "Available"
}
```

**Valid status values:**
- `"Available"` → is_hidden = false
- `"Hidden"` → is_hidden = true

**Response:**
```json
{
  "message": "Product status updated to Available",
  "product": {
    "_id": "product_id",
    "is_hidden": false,
    "updated_at": "new_date"
  }
}
```

**Example:**
```bash
curl -X PATCH "http://localhost:3000/api/products/67890abc/status" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"status": "Hidden"}'
```

---

### 6. DELETE Product - ✅ Phù hợp

**Endpoint:** `DELETE /api/products/:productId`

**Response:**
```json
{
  "message": "Product and associated inventory deleted successfully"
}
```

**Example:**
```bash
curl -X DELETE "http://localhost:3000/api/products/67890abc" \
  -H "Authorization: Bearer your-jwt-token"
```

---

### 7. UPLOAD Image - ✅ Phù hợp

**Endpoint:** `POST /api/products/upload-image`

**Body (multipart/form-data):**
```
image: <File>
```

**Response:**
```json
{
  "url": "uploads/products/image-1234567890-123456789.jpg",
  "imageId": "image-1234567890-123456789.jpg"
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/products/upload-image" \
  -H "Authorization: Bearer your-jwt-token" \
  -F "image=@/path/to/image.jpg"
```

**Notes:**
- Accept: jpeg, jpg, png, gif, webp
- Max file size: 5MB
- Trả về URL để sử dụng trong create/update product

---

### 8. SAVE DRAFT - ✅ Phù hợp

**Endpoint:** `POST /api/products/draft`

**Body (JSON):**
```json
{
  "title": "Draft Product",
  "description": "Draft description",
  "price": 0,
  "sku": "DRAFT-001",
  "image_url": "https://example.com/draft.jpg"
}
```

**Notes:**
- Draft products được tự động set `is_hidden = true`
- Các fields không bắt buộc sẽ có giá trị default
- Default SKU: `DRAFT-{timestamp}` nếu không cung cấp

**Response:**
```json
{
  "message": "Draft saved successfully",
  "product": {
    "_id": "product_id",
    "title": "Draft Product",
    "is_hidden": true,
    "sku": "DRAFT-001"
  },
  "inventory": {
    "_id": "inventory_id",
    "quantity": 0
  }
}
```

**Example:**
```bash
curl -X POST "http://localhost:3000/api/products/draft" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Product Draft",
    "description": "Work in progress"
  }'
```

---

## 🔄 Backward Compatibility

Các API cũ với `:storeId` vẫn hoạt động nhưng **không khuyến khích** sử dụng:

```
POST   /api/products/:storeId/create
GET    /api/products/:storeId/list
GET    /api/products/:storeId/:productId
PUT    /api/products/:storeId/:productId
PATCH  /api/products/:storeId/:productId/hide
DELETE /api/products/:storeId/:productId
```

---

## 🎯 Frontend Integration Checklist

- ✅ GET /api/products?search=&status=&page=&limit=
- ✅ GET /api/products/:productId
- ✅ POST /api/products (JSON body)
- ✅ PUT /api/products/:productId (JSON body)
- ✅ PATCH /api/products/:productId/status
- ✅ DELETE /api/products/:productId
- ✅ POST /api/products/upload-image
- ✅ POST /api/products/draft

**Tất cả 8/8 APIs đều phù hợp 100% với Frontend!** 🎉

---

## 🛠️ Testing

### 1. Login to get JWT token:
```bash
curl -X POST "http://localhost:3000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'
```

### 2. Use token in subsequent requests:
```bash
export TOKEN="your-jwt-token-here"

# Get products list
curl -X GET "http://localhost:3000/api/products?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Create product
curl -X POST "http://localhost:3000/api/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Product", "price": 100, "sku": "TEST-001"}'
```

---

## ⚠️ Important Notes

1. **JWT Token Required**: Tất cả APIs đều cần JWT token
2. **Store Auto-detection**: StoreId tự động lấy từ userId trong token
3. **JSON Support**: Tất cả APIs hỗ trợ JSON body (không bắt buộc multipart)
4. **Status Mapping**: 
   - Frontend `"Available"` → Backend `is_hidden: false`
   - Frontend `"Hidden"` → Backend `is_hidden: true`
5. **Pagination**: Default page=1, limit=10
6. **Search**: Case-insensitive search trên title, description, sku

---

## 🔗 Related Files

- **Routes**: `src/routes/productRoutes.js`
- **Controller**: `src/controllers/productController.js`
- **Helper**: `src/utils/storeHelper.js`
- **Model**: `src/models/productModel.js`
- **Middleware**: `src/middleware/authMiddleware.js`
