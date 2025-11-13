// routes/listing.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sellerCheck = require('../middleware/sellerCheck');
const Listing = require('../models/Listing');
const Store = require('../models/Store');
const Category = require('../models/Category');

// Get seller's listings
router.get('/my-listings', auth, sellerCheck, async (req, res) => {
  try {
    const listings = await Listing.find({ sellerId: req.sellerId })
      .populate('categoryId')
      .sort({ createdAt: -1 });

    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create listing
router.post('/create', auth, sellerCheck, async (req, res) => {
  try {
    const {
      title,
      subtitle,
      categoryId,
      condition,
      itemSpecifics,
      listingType,
      fixedPrice,
      totalQuantity,
      inventorySku,
      description,
    } = req.body;

    // Get seller's store
    const store = await Store.findOne({ sellerId: req.sellerId });

    if (!store) {
      return res.status(400).json({ message: 'Please create a store first' });
    }

    // Create listing
    const listing = await Listing.create({
      sellerId: req.sellerId,
      storeId: store._id,
      inventoryMode: 'single',
      inventorySku,
      title,
      subtitle,
      categoryId,
      condition,
      itemSpecifics,
      listingType: listingType || 'fixed_price',
      pricing: {
        currency: 'VND',
        fixedPrice,
      },
      totalQuantity,
      shippingPolicyId: store.policies.shippingPolicyId,
      returnPolicyId: store.policies.returnPolicyId,
      paymentPolicyId: store.policies.paymentPolicyId,
      status: 'active',
      startTime: new Date(),
      stats: {
        views: 0,
        watchers: 0,
        soldQuantity: 0,
      },
    });

    res.status(201).json({
      message: 'Listing created successfully',
      listing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update listing
router.put('/:id', auth, sellerCheck, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      sellerId: req.sellerId
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Update fields
    const allowedFields = ['title', 'subtitle', 'condition', 'fixedPrice', 'totalQuantity', 'status'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'fixedPrice') {
          listing.pricing.fixedPrice = req.body[field];
        } else {
          listing[field] = req.body[field];
        }
      }
    });

    await listing.save();

    res.json({
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete listing
router.delete('/:id', auth, sellerCheck, async (req, res) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.sellerId
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;