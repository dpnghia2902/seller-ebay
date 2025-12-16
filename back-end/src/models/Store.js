const mongoose = require('mongoose');
const { Schema } = mongoose;
// models/Store.js
const StoreSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', required: true, index: true },
    name: { type: String, required: true },
    slug: { type: String, unique: true, required: true },
    logoUrl: String,
    bannerUrl: String,
    description: String,
    planId: { type: Schema.Types.ObjectId, ref: 'StorePlan' },
    subscription: {
      status: {
        type: String,
        enum: ['none', 'active', 'expired', 'cancelled'],
        default: 'none',
      },
      startDate: Date,
      endDate: Date,
      autoRenew: { type: Boolean, default: true },
      billingCycle: { type: String, enum: ['monthly', 'yearly'] },
    },
    policies: {
      shippingPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
      returnPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
      paymentPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
    },
    tags: [String],
    isPublic: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Store', StoreSchema);