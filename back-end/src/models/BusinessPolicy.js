const mongoose = require('mongoose');
const { Schema } = mongoose;
const BusinessPolicySchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', required: true, index: true },
    type: { type: String, enum: ['shipping', 'payment', 'return'], required: true },
    name: { type: String, required: true },
    description: String,
    config: Schema.Types.Mixed,
    isDefault: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessPolicy', BusinessPolicySchema);