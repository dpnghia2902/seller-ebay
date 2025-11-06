const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  banner_url: {
    type: String
  },
  description: {
    type: String
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
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
});

module.exports = mongoose.model('Store', storeSchema, 'stores');
