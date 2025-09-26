const mongoose = require('mongoose');

const salesReportSchema = new mongoose.Schema({
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  total_sales: {
    type: Number,
    required: true
  },
  total_orders: {
    type: Number,
    required: true
  },
  report_date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('SalesReport', salesReportSchema, 'sales_reports');
