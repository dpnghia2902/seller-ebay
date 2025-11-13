const mongoose = require('mongoose');
const { Schema } = mongoose;
// models/SellerProfile.js
const SellerProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected', 'suspended'],
      default: 'pending',
    },
    legalName: String,
    businessType: String,
    businessRegistrationNumber: String,
    taxId: String,
    contact: {
      phone: String,
      email: String,
    },
    payoutAccount: {
      method: { type: String, enum: ['bank', 'paypal', 'other'] },
      bankName: String,
      accountNumberMasked: String,
      accountHolder: String,
      paypalEmail: String,
    },
    kycDocs: [
      {
        type: { type: String },
        url: String,
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending',
        },
        note: String,
      },
    ],
    verificationLevel: { type: Number, default: 0 },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: Date,
    reviewNote: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('SellerProfile', SellerProfileSchema);