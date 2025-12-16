const mongoose = require('mongoose');
const { Schema } = mongoose;
// models/StorePlan.js
const StorePlanSchema = new Schema(
  {
    code: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    description: String,
    monthlyPrice: Number,
    yearlyPrice: Number,
    maxActiveListings: Number,
    freeListingsPerMonth: Number,
    discountOnFeesPercent: Number,
    features: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StorePlan', StorePlanSchema);
