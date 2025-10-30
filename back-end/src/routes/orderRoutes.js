const express = require('express');
const { getAllOrders, updateOrderStatus, printShippingLabel } = require('../controllers/orderController');
const router = express.Router();

router.get('/', getAllOrders);
router.put('/:id/status', updateOrderStatus);
router.get('/:id/print', printShippingLabel);

module.exports = router;
