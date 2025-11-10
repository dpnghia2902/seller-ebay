const express = require('express');
const { getAllOrders, updateOrderStatus, printShippingLabel } = require('../controllers/orderController');
const authenticateJWT = require('../middleware/authMiddleware');
const router = express.Router();

// All order routes require JWT authentication
router.get('/', authenticateJWT, getAllOrders);
router.put('/:id/status', authenticateJWT, updateOrderStatus);
router.get('/:id/print', authenticateJWT, printShippingLabel);

module.exports = router;
