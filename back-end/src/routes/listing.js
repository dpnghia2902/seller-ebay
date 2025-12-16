// routes/listing.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const sellerCheck = require('../middleware/sellerCheck');
const Listing = require('../models/Listing');
const Store = require('../models/Store');
const { upload, cloudinary } = require('../config/cloudinary');
// Get seller's listings
router.get('/my-listings', auth, sellerCheck, async (req, res) => {
  try {
    const listings = await Listing.find({ sellerId: req.sellerId })
      .populate('categoryId')
      .sort({ createdAt: -1 }).lean();
    console.log(listings);
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Upload images (có thể gọi trước khi tạo listing)
router.post('/upload-images', auth, sellerCheck, upload.array('images', 12), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const images = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      isPrimary: index === 0,
      order: index
    }));

    res.json({ images });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete single image
router.delete('/delete-image/:publicId', auth, sellerCheck, async (req, res) => {
  try {
    const publicId = req.params.publicId;
    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create listing with images
router.post('/create', auth, sellerCheck, upload.array('images', 12), async (req, res) => {
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
      imagesData // Nếu images đã upload trước đó
    } = req.body;

    // Get seller's store
    const store = await Store.findOne({ sellerId: req.sellerId });

    if (!store) {
      return res.status(400).json({ message: 'Please create a store first' });
    }

    // Xử lý images
    let images = [];

    // Nếu upload cùng lúc với form
    if (req.files && req.files.length > 0) {
      images = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        isPrimary: index === 0,
        order: index
      }));
    }
    // Nếu đã upload trước và gửi qua body
    else if (imagesData) {
      images = JSON.parse(imagesData);
    }

    // Parse itemSpecifics if it's a string
    const parsedItemSpecifics = typeof itemSpecifics === 'string'
      ? JSON.parse(itemSpecifics)
      : itemSpecifics;

    // Create listing
    const listing = await Listing.create({
      sellerId: req.sellerId,
      storeId: store._id,
      images,
      inventoryMode: 'single',
      inventorySku,
      title,
      subtitle,
      description,
      categoryId,
      condition,
      itemSpecifics: parsedItemSpecifics,
      listingType: listingType || 'fixed_price',
      pricing: {
        currency: 'VND',
        fixedPrice: parseFloat(fixedPrice),
      },
      totalQuantity: parseInt(totalQuantity),
      shippingPolicyId: store.policies?.shippingPolicyId,
      returnPolicyId: store.policies?.returnPolicyId,
      paymentPolicyId: store.policies?.paymentPolicyId,
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
    console.error('Create listing error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update listing
router.put('/:id', auth, sellerCheck, upload.array('newImages', 12), async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      sellerId: req.sellerId
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Update basic fields
    const allowedFields = ['title', 'subtitle', 'condition', 'fixedPrice', 'totalQuantity', 'status', 'description'];
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'fixedPrice') {
          listing.pricing.fixedPrice = req.body[field];
        } else {
          listing[field] = req.body[field];
        }
      }
    });

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file, index) => ({
        url: file.path,
        publicId: file.filename,
        isPrimary: listing.images.length === 0 && index === 0,
        order: listing.images.length + index
      }));
      listing.images.push(...newImages);
    }

    // Handle image deletion
    if (req.body.deletedImages) {
      const deletedImages = JSON.parse(req.body.deletedImages);
      for (const publicId of deletedImages) {
        await cloudinary.uploader.destroy(publicId);
        listing.images = listing.images.filter(img => img.publicId !== publicId);
      }
    }

    await listing.save();

    res.json({
      message: 'Listing updated successfully',
      listing
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete listing (also delete images)
router.delete('/:id', auth, sellerCheck, async (req, res) => {
  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      sellerId: req.sellerId
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Delete all images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      for (const image of listing.images) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    await listing.deleteOne();

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;