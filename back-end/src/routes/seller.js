// routes/seller.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');
const orderController = require('../controllers/orderController');

// Get seller profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.sellerProfileId) {
      return res.status(404).json({ message: 'No seller profile found' });
    }

    const sellerProfile = await SellerProfile.findById(user.sellerProfileId);
    res.json(sellerProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit verification
router.post('/verify', auth, async (req, res) => {
  try {
    const { legalName, businessType, businessRegistrationNumber, taxId, contact, payoutAccount } = req.body;

    const user = await User.findById(req.userId);

    // Check if seller profile already exists
    if (user.sellerProfileId) {
      const existingProfile = await SellerProfile.findById(user.sellerProfileId);
      if (existingProfile.status === 'verified') {
        return res.status(400).json({ message: 'Already verified' });
      }

      // Update existing profile
      existingProfile.legalName = legalName;
      existingProfile.businessType = businessType;
      existingProfile.businessRegistrationNumber = businessRegistrationNumber;
      existingProfile.taxId = taxId;
      existingProfile.contact = contact;
      existingProfile.payoutAccount = payoutAccount;
      existingProfile.status = 'pending';

      await existingProfile.save();

      return res.json({
        message: 'Verification request updated',
        sellerProfile: existingProfile
      });
    }

    // Create new seller profile
    const sellerProfile = await SellerProfile.create({
      userId: user._id,
      status: 'pending',
      legalName,
      businessType,
      businessRegistrationNumber,
      taxId,
      contact,
      payoutAccount,
    });

    // Update user
    user.sellerProfileId = sellerProfile._id;
    if (!user.roles.includes('seller')) {
      user.roles.push('seller');
    }
    await user.save();

    res.status(201).json({
      message: 'Verification request submitted',
      sellerProfile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Order management routes
router.get('/orders', auth, orderController.getSellerOrders);
router.get('/orders/stats', auth, orderController.getOrderStats);
router.get('/orders/:orderId', auth, orderController.getOrderById);
router.put('/orders/:orderId/status', auth, orderController.updateOrderStatus);
router.post('/orders/:orderId/tracking', auth, orderController.addTracking);

// Review management routes
const reviewController = require('../controllers/reviewController');
const sellerCheck = require('../middleware/sellerCheck');

router.get('/reviews', auth, sellerCheck, reviewController.getSellerReviews);
router.get('/reviews/statistics', auth, sellerCheck, reviewController.getReviewStatistics);
router.post('/reviews/:reviewId/respond', auth, sellerCheck, reviewController.respondToReview);
router.put('/reviews/:reviewId/response', auth, sellerCheck, reviewController.updateReviewResponse);
router.post('/reviews/:reviewId/hide', auth, sellerCheck, reviewController.hideReview);
router.post('/reviews/:reviewId/unhide', auth, sellerCheck, reviewController.unhideReview);
router.post('/reviews/:reviewId/report', auth, sellerCheck, reviewController.reportReview);

module.exports = router;