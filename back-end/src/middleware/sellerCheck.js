// middleware/sellerCheck.js
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');

module.exports = async function (req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.roles.includes('seller')) {
      return res.status(403).json({ message: 'Seller role required' });
    }

    if (!user.sellerProfileId) {
      return res.status(403).json({
        message: 'Seller profile not found',
        needsVerification: true
      });
    }

    const sellerProfile = await SellerProfile.findById(user.sellerProfileId);

    if (!sellerProfile) {
      return res.status(403).json({
        message: 'Seller profile not found',
        needsVerification: true
      });
    }

    if (sellerProfile.status !== 'verified') {
      return res.status(403).json({
        message: 'Seller account not verified',
        needsVerification: true,
        status: sellerProfile.status
      });
    }

    req.sellerId = sellerProfile._id;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};