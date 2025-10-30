const AddressSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['shipping', 'billing', 'warehouse'],
    default: 'shipping'
  },
  full_name: String,
  phone: String,
  street: String,
  ward: String,
  district: String,
  city: String,
  postal_code: String,
  country: String,
  is_default: { type: Boolean, default: false }
});

module.exports = mongoose.model('Address', AddressSchema, 'addresses');
