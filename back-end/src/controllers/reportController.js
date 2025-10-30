const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const SalesReport = require('../models/salesReportModel');

// Báo cáo doanh số theo tuần / tháng
exports.generateReport = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const start = new Date();
    if (period === 'week') start.setDate(start.getDate() - 7);
    else start.setMonth(start.getMonth() - 1);

    const orders = await Order.find({ created_at: { $gte: start } });

    const totalSales = orders.reduce((sum, o) => sum + o.total_amount, 0);
    const totalOrders = orders.length;

    const report = new SalesReport({
      store_id: orders[0]?.store_id
        ? new mongoose.Types.ObjectId(orders[0].store_id)
        : new mongoose.Types.ObjectId(), 
      total_sales: totalSales,
      total_orders: totalOrders,
      report_date: new Date()
    });

    await report.save();
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
