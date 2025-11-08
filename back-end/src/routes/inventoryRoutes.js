const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const authenticateJWT = require('../middleware/authMiddleware');

// GET /api/inventory/:storeId - Get all inventory for a store (CẦN JWT - thông tin nhạy cảm)
router.get('/:storeId', authenticateJWT, inventoryController.getStoreInventory);

// PATCH /api/inventory/:inventoryId - Update inventory by ID (CẦN JWT)
router.patch('/:inventoryId', authenticateJWT, inventoryController.updateInventory);

// POST /api/inventory/:storeId/:productId/stock-adjust - Quick stock adjustment (CẦN JWT)
router.post('/:storeId/:productId/stock-adjust', authenticateJWT, inventoryController.adjustProductStock);

module.exports = router;
