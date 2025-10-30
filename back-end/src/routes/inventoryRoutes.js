const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// GET /api/inventory/:storeId - Get all inventory for a store
router.get('/:storeId', inventoryController.getStoreInventory);

// PATCH /api/inventory/:inventoryId - Update inventory by ID (adjust quantity)
router.patch('/:inventoryId', inventoryController.updateInventory);

// POST /api/inventory/:storeId/:productId/stock-adjust - Quick stock adjustment
router.post('/:storeId/:productId/stock-adjust', inventoryController.adjustProductStock);

module.exports = router;
