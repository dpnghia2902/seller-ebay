const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema(
  {
    // Order and listing references
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
      index: true,
    },
    listingId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
      index: true,
    },
    
    // Buyer information
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    buyerName: String,
    buyerUsername: String,
    
    // Seller information
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'SellerProfile',
      required: true,
      index: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      index: true,
    },
    
    // Review content
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },
    title: String,
    comment: {
      type: String,
      maxlength: 5000,
    },
    photos: [String],
    
    // Review status (similar to eBay)
    status: {
      type: String,
      enum: ['published', 'hidden', 'removed', 'pending_moderation'],
      default: 'published',
      index: true,
    },
    
    // Seller response
    sellerResponse: {
      message: {
        type: String,
        maxlength: 5000,
      },
      respondedAt: Date,
      updatedAt: Date,
    },
    
    // Moderation flags
    isReported: {
      type: Boolean,
      default: false,
    },
    reportedReason: String,
    reportedAt: Date,
    
    // Helpful votes (like eBay's "Was this review helpful?")
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    notHelpfulVotes: {
      type: Number,
      default: 0,
    },
    
    // Review metadata
    verifiedPurchase: {
      type: Boolean,
      default: true, // Only verified buyers can leave reviews
    },
    reviewDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
    
    // Additional metadata
    ipAddress: String, // For fraud detection
    deviceInfo: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
ReviewSchema.index({ sellerId: 1, status: 1, reviewDate: -1 });
ReviewSchema.index({ listingId: 1, status: 1 });
ReviewSchema.index({ buyerId: 1, orderId: 1 }, { unique: true }); // One review per order

// Virtual for helpful percentage
ReviewSchema.virtual('helpfulPercentage').get(function() {
  const total = this.helpfulVotes + this.notHelpfulVotes;
  if (total === 0) return 0;
  return Math.round((this.helpfulVotes / total) * 100);
});

// Method to check if seller can respond
ReviewSchema.methods.canRespond = function() {
  return !this.sellerResponse || !this.sellerResponse.message;
};

module.exports = mongoose.model('Review', ReviewSchema);

