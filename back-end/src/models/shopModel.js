const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  owner_id: {                // Tham chiếu đến User
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shop_name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  banner_url: {
    type: String
  },
  description: {
    type: String,
    default: ''
  },
  is_active: {
    type: Boolean,
    default: true
  },
  address: {                 // Nhúng trực tiếp địa chỉ shop
    full_name: String,
    phone: String,
    street: String,
    ward: String,
    district: String,
    city: String,
    postal_code: String,
    country: String
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shop', shopSchema, 'shops');
