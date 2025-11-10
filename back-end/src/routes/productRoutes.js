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

// ============= NEW ROUTES FOR FRONTEND COMPATIBILITY =============
// NOTE: Specific routes MUST come before parameterized routes to avoid conflicts

// POST /api/products/upload-image - Upload single image
router.post('/upload-image', authenticateJWT, upload.single('image'), productController.uploadProductImage);

// POST /api/products/draft - Save product draft
router.post('/draft', authenticateJWT, productController.saveDraft);

// GET /api/products?search=&status=&page=&limit= - Get all products với pagination
router.get('/', authenticateJWT, productController.getAllProducts);

// POST /api/products - Create product (JSON body)
router.post('/', authenticateJWT, productController.createProductNew);

// PATCH /api/products/:productId/status - Update product status (must be before /:productId)
router.patch('/:productId/status', authenticateJWT, productController.updateProductStatus);

// GET /api/products/:productId - Get single product
router.get('/:productId', authenticateJWT, productController.getProductById);

// PUT /api/products/:productId - Update product (JSON body)
router.put('/:productId', authenticateJWT, productController.updateProductNew);

// DELETE /api/products/:productId - Delete product
router.delete('/:productId', authenticateJWT, productController.deleteProductNew);

// ============= OLD ROUTES (Deprecated - for backward compatibility) =============
// These routes with :storeId are kept for backward compatibility
// Recommended to use the new routes above

// POST /api/products/:storeId - Tạo sản phẩm với storeId
router.post('/:storeId/create', authenticateJWT, upload.array('images', 5), productController.createProduct);

// GET /api/products/:storeId/list - Xem danh sách sản phẩm
router.get('/:storeId/list', productController.getStoreProducts);

// GET /api/products/:storeId/:productId - Xem chi tiết sản phẩm
router.get('/:storeId/:productId', productController.getStoreProductById);

// PUT /api/products/:storeId/:productId - Cập nhật sản phẩm
router.put('/:storeId/:productId', authenticateJWT, upload.array('images', 5), productController.updateProduct);

// PATCH /api/products/:storeId/:productId/hide - Ẩn/hiện sản phẩm (toggle)
router.patch('/:storeId/:productId/hide', authenticateJWT, productController.toggleProductVisibility);

// DELETE /api/products/:storeId/:productId - Xóa sản phẩm
router.delete('/:storeId/:productId', authenticateJWT, productController.deleteProduct);

module.exports = router;
