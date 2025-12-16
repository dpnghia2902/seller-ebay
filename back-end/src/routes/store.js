// routes/store.js
// routes/seller.js
const express = require('express');
const router = express.Router();
const Store = require('../models/Store');
const StorePlan = require('../models/StorePlan');
const sellerCheck = require('../middleware/sellerCheck');
const auth = require('../middleware/auth');
const User = require('../models/User');
// Get store plans
router.get('/plans', auth, async (req, res) => {
  try {
    const plans = await StorePlan.find({ isActive: true });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get seller's store
router.get('/my-store', auth, sellerCheck, async (req, res) => {
  try {
    const store = await Store.findOne({ sellerId: req.sellerId }).populate('planId');

    if (!store) {
      return res.status(404).json({ message: 'No store found' });
    }

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create store with subscription
router.post('/create', auth, sellerCheck, async (req, res) => {
  try {
    const { name, slug, description, planId, billingCycle } = req.body;

    // Check if store already exists
    const existingStore = await Store.findOne({ sellerId: req.sellerId });
    if (existingStore) {
      return res.status(400).json({ message: 'Store already exists' });
    }

    // Check slug uniqueness
    const slugExists = await Store.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({ message: 'Store slug already taken' });
    }

    // Get plan
    const plan = await StorePlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Calculate subscription dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    // Create store
    const store = await Store.create({
      sellerId: req.sellerId,
      name,
      slug,
      description,
      planId: plan._id,
      subscription: {
        status: 'active',
        startDate,
        endDate,
        autoRenew: true,
        billingCycle,
      },
      isPublic: true,
    });

    res.status(201).json({
      message: 'Store created successfully',
      store
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update store
router.put('/update', auth, sellerCheck, async (req, res) => {
  try {
    const { name, description, logoUrl, bannerUrl, tags } = req.body;

    const store = await Store.findOne({ sellerId: req.sellerId });
    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    if (name) store.name = name;
    if (description) store.description = description;
    if (logoUrl) store.logoUrl = logoUrl;
    if (bannerUrl) store.bannerUrl = bannerUrl;
    if (tags) store.tags = tags;

    await store.save();

    res.json({
      message: 'Store updated successfully',
      store
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;