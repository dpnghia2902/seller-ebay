const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const shopController = require('../controllers/shopController');

// Tạo shop mới (user phải đăng nhập)
router.post('/register', authenticateJWT, shopController.createShop);

// Lấy thông tin shop theo id
router.get('/:id', shopController.getShopById);

// Cập nhật shop (chỉ chủ shop)
router.put('/:id', authenticateJWT, shopController.updateShop);

// Xóa shop (chỉ chủ shop hoặc admin)
router.delete('/:id', authenticateJWT, shopController.deleteShop);

module.exports = router;
