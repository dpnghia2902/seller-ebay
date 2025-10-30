const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true
  },
  store_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  discount_type: {
    type: String,
    enum: ['percent', 'fixed'],
    required: true
  },
  discount_value: {
    type: Number,
    required: true
  },
  usage_limit: {
    type: Number,
    required: true
  },
  expires_at: {
    type: Date,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Coupon', couponSchema, 'coupons');
