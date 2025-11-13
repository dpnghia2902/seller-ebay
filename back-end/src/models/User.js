const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true, index: true },
    passwordHash: { type: String, required: true },
    name: String,
    roles: { type: [String], default: ['buyer'] },
    defaultRole: { type: String, default: 'buyer' },
    buyerProfile: {
      phone: String,
      defaultShippingAddressId: Schema.Types.ObjectId,
    },
    sellerProfileId: { type: Schema.Types.ObjectId, ref: 'SellerProfile' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
