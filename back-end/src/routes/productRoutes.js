const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authenticateJWT = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products/'); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Routes for Product with Store ID in the path
// POST /api/products/:storeId - Tạo sản phẩm (CẦN JWT)
router.post('/:storeId', authenticateJWT, upload.array('images', 5), productController.createProduct);

// GET /api/products/:storeId - Xem danh sách sản phẩm (Public - không cần JWT)
router.get('/:storeId', productController.getStoreProducts);

// GET /api/products/:storeId/:productId - Xem chi tiết sản phẩm (Public - không cần JWT)
router.get('/:storeId/:productId', productController.getStoreProductById);

// PUT /api/products/:storeId/:productId - Cập nhật sản phẩm (CẦN JWT)
router.put('/:storeId/:productId', authenticateJWT, upload.array('images', 5), productController.updateProduct);

// PATCH /api/products/:storeId/:productId/hide - Ẩn/hiện sản phẩm (CẦN JWT)
router.patch('/:storeId/:productId/hide', authenticateJWT, productController.toggleProductVisibility);

// DELETE /api/products/:storeId/:productId - Xóa sản phẩm (CẦN JWT)
router.delete('/:storeId/:productId', authenticateJWT, productController.deleteProduct);

module.exports = router;
