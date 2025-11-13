// routes/seller.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const SellerProfile = require('../models/SellerProfile');

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

module.exports = router;