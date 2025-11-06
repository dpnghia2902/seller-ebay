const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

/**
 * Dashboard API Routes
 * Base path: /api/dashboard
 */

// GET /api/dashboard/summary
// Returns: { totalSales: number, income: number }
router.get('/summary', dashboardController.getSummary);

// GET /api/dashboard/sales-monthly
// Query params: months (optional, default 6)
// Returns: [ { month: string, value: number }, ... ]
router.get('/sales-monthly', dashboardController.getMonthlySales);

// GET /api/dashboard/top-products
// Query params: limit (optional, default 10)
// Returns: { products: [ { id, name, color, price, sold, status } ] }
router.get('/top-products', dashboardController.getTopProducts);

module.exports = router;
