const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    // Order identification
    orderNumber: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    
    // Buyer information
    buyerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true,
      index: true 
    },
    buyerName: String,
    buyerUsername: String,
    
    // Seller information
    sellerId: { 
      type: Schema.Types.ObjectId, 
      ref: 'SellerProfile', 
      required: true,
      index: true 
    },
    storeId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Store',
      index: true 
    },
    
    // Listing information
    listingId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Listing', 
      required: true 
    },
    listingTitle: String,
    listingImage: String,
    customSku: String,
    
    // Variation details (if applicable)
    variationDetails: {
      sku: String,
      attributes: [{ 
        name: String, 
        value: String 
      }]
    },
    
    // Pricing details
    pricing: {
      itemPrice: { type: Number, required: true },
      quantity: { type: Number, required: true, default: 1 },
      subtotal: Number,
      shippingCost: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: 'USD' }
    },
    
    // Shipping information
    shippingAddress: {
      fullName: String,
      phone: String,
      street: String,
      ward: String,
      district: String,
      city: String,
      postalCode: String,
      country: String
    },
    
    // Tracking information
    tracking: {
      carrier: String,
      trackingNumber: String,
      shippedDate: Date,
      estimatedDelivery: Date,
      actualDelivery: Date
    },
    
    // Order status
    status: {
      type: String,
      enum: [
        'awaiting_payment',
        'awaiting_shipment', 
        'shipped',
        'delivered',
        'returned',
        'refunded',
        'cancelled',
        'delivery_failed'
      ],
      default: 'awaiting_payment',
      index: true
    },
    
    // Payment information
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: String,
    paymentDate: Date,
    
    // Important dates
    purchaseDate: { 
      type: Date, 
      default: Date.now,
      index: true 
    },
    paymentDueDate: Date,
    
    // Notes and communication
    buyerNotes: String,
    sellerNotes: String,
    
    // Flags
    isGift: { type: Boolean, default: false },
    isPriority: { type: Boolean, default: false },
    
    // Return/Refund information
    returnRequest: {
      requested: { type: Boolean, default: false },
      reason: String,
      requestDate: Date,
      status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'completed']
      }
    },
    
    refundInfo: {
      amount: Number,
      reason: String,
      refundDate: Date
    }
  },
  { 
    timestamps: true 
  }
);

// Indexes for common queries
OrderSchema.index({ sellerId: 1, status: 1 });
OrderSchema.index({ sellerId: 1, purchaseDate: -1 });
OrderSchema.index({ buyerUsername: 1 });

// Virtual for days since purchase
OrderSchema.virtual('daysSincePurchase').get(function() {
  return Math.floor((Date.now() - this.purchaseDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to calculate totals
OrderSchema.pre('save', function(next) {
  if (this.isModified('pricing')) {
    this.pricing.subtotal = this.pricing.itemPrice * this.pricing.quantity;
    this.pricing.total = this.pricing.subtotal + this.pricing.shippingCost + this.pricing.tax;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
