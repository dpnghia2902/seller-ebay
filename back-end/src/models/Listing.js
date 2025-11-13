const mongoose = require('mongoose');
const { Schema } = mongoose;

// models/Listing.js
const ListingSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'SellerProfile', required: true, index: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store', index: true },
    inventoryMode: {
      type: String,
      enum: ['single', 'variation'],
      default: 'single',
    },
    inventorySku: String,
    variations: [
      {
        sku: String,
        attributes: [{ name: String, value: String }],
        price: Number,
        quantityOverride: Number,
      },
    ],
    title: { type: String, required: true },
    subtitle: String,
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    condition: String,
    itemSpecifics: [
      {
        name: String,
        value: String,
      },
    ],
    listingType: {
      type: String,
      enum: ['fixed_price', 'auction'],
      default: 'fixed_price',
    },
    pricing: {
      currency: { type: String, default: 'USD' },
      fixedPrice: Number,
      auction: {
        startPrice: Number,
        buyItNowPrice: Number,
        reservePrice: Number,
        durationDays: Number,
      },
    },
    totalQuantity: Number,
    shippingPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
    returnPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
    paymentPolicyId: { type: Schema.Types.ObjectId, ref: 'BusinessPolicy' },
    status: {
      type: String,
      enum: ['draft', 'active', 'scheduled', 'ended', 'paused'],
      default: 'draft',
      index: true,
    },
    startTime: Date,
    endTime: Date,
    stats: {
      views: { type: Number, default: 0 },
      watchers: { type: Number, default: 0 },
      soldQuantity: { type: Number, default: 0 },
    },
    isFeatured: { type: Boolean, default: false },
    isPromoted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Listing', ListingSchema);