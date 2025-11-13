const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');
const Category = require('../models/Category');

// routes/public.js
// Public APIs (không cần authentication)

// Get featured listings for homepage
router.get('/featured', async (req, res) => {
  try {
    const featuredListings = await Listing.find({
      status: 'active',
      isFeatured: true
    })
      .populate('categoryId')
      .populate('storeId')
      .limit(20)
      .sort({ createdAt: -1 });

    res.json(featuredListings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get active listings
router.get('/listings', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;

    const query = { status: 'active' };

    if (category) {
      query.categoryId = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(query)
      .populate('categoryId')
      .populate('storeId')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single listing
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('categoryId')
      .populate('storeId')
      .populate('sellerId');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Increment views
    listing.stats.views += 1;
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;