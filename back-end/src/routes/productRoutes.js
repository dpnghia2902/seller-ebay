const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
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
// POST /api/products/:storeId
router.post('/:storeId', upload.array('images', 5), productController.createProduct);

// GET /api/products/:storeId
router.get('/:storeId', productController.getStoreProducts);

// GET /api/products/:storeId/:productId
router.get('/:storeId/:productId', productController.getStoreProductById);

// PUT /api/products/:storeId/:productId
router.put('/:storeId/:productId', upload.array('images', 5), productController.updateProduct);

// PATCH /api/products/:storeId/:productId/hide
router.patch('/:storeId/:productId/hide', productController.toggleProductVisibility);

// DELETE /api/products/:storeId/:productId
router.delete('/:storeId/:productId', productController.deleteProduct);

module.exports = router;
