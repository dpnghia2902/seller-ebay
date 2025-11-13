const Review = require('../models/Review');
const Order = require('../models/Order');
const Listing = require('../models/Listing');
const User = require('../models/User');
const mongoose = require('mongoose');

/**
 * Get all reviews for a seller with filters and pagination
 * Similar to eBay Seller Hub's review management
 */
exports.getSellerReviews = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const {
      page = 1,
      limit = 20,
      rating,
      status = 'published',
      sort = 'newest', // newest, oldest, highest_rating, lowest_rating
      search,
      hasResponse,
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    // Build query
    const query = { sellerId };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating);
    }

    // Filter by search term (searches in comment, title, buyer name)
    if (search) {
      query.$or = [
        { comment: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { buyerUsername: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by response status
    if (hasResponse === 'true') {
      query['sellerResponse.message'] = { $exists: true, $ne: '' };
    } else if (hasResponse === 'false') {
      query.$or = [
        { 'sellerResponse.message': { $exists: false } },
        { 'sellerResponse.message': '' },
      ];
    }

    // Build sort
    let sortOption = {};
    switch (sort) {
      case 'oldest':
        sortOption = { reviewDate: 1 };
        break;
      case 'highest_rating':
        sortOption = { rating: -1, reviewDate: -1 };
        break;
      case 'lowest_rating':
        sortOption = { rating: 1, reviewDate: -1 };
        break;
      case 'newest':
      default:
        sortOption = { reviewDate: -1 };
        break;
    }

    // Get reviews
    const reviews = await Review.find(query)
      .populate('listingId', 'title images pricing')
      .populate('buyerId', 'name email')
      .populate('orderId', 'orderNumber purchaseDate')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .lean();

    // Get total count
    const total = await Review.countDocuments(query);

    // Get statistics
    const stats = await Review.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingDistribution: {
            $push: '$rating',
          },
          publishedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
          hiddenCount: {
            $sum: { $cond: [{ $eq: ['$status', 'hidden'] }, 1, 0] },
          },
          respondedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ['$sellerResponse.message', false] },
                    { $ne: ['$sellerResponse.message', ''] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const statistics = stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: [],
      publishedCount: 0,
      hiddenCount: 0,
      respondedCount: 0,
    };

    // Calculate rating distribution
    const ratingDistribution = {
      5: statistics.ratingDistribution.filter((r) => r === 5).length,
      4: statistics.ratingDistribution.filter((r) => r === 4).length,
      3: statistics.ratingDistribution.filter((r) => r === 3).length,
      2: statistics.ratingDistribution.filter((r) => r === 2).length,
      1: statistics.ratingDistribution.filter((r) => r === 1).length,
    };

    // Calculate response rate
    const responseRate =
      statistics.totalReviews > 0
        ? (statistics.respondedCount / statistics.totalReviews) * 100
        : 0;

    res.json({
      reviews,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
      statistics: {
        totalReviews: statistics.totalReviews,
        averageRating: statistics.averageRating
          ? Number(statistics.averageRating.toFixed(2))
          : 0,
        ratingDistribution,
        publishedCount: statistics.publishedCount,
        hiddenCount: statistics.hiddenCount,
        respondedCount: statistics.respondedCount,
        responseRate: Number(responseRate.toFixed(1)),
      },
    });
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Respond to a review
 * Similar to eBay's seller response feature
 */
exports.respondToReview = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { reviewId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Response message is required' });
    }

    if (message.length > 5000) {
      return res
        .status(400)
        .json({ message: 'Response message cannot exceed 5000 characters' });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Verify seller owns this review
    if (review.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Check if review is published
    if (review.status !== 'published') {
      return res
        .status(400)
        .json({ message: 'Can only respond to published reviews' });
    }

    // Update or create response
    review.sellerResponse = {
      message: message.trim(),
      respondedAt: review.sellerResponse?.respondedAt || new Date(),
      updatedAt: new Date(),
    };

    await review.save();

    res.json({
      message: 'Response added successfully',
      review,
    });
  } catch (error) {
    console.error('Error responding to review:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update review response
 */
exports.updateReviewResponse = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { reviewId } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Response message is required' });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (!review.sellerResponse || !review.sellerResponse.message) {
      return res.status(400).json({ message: 'No existing response to update' });
    }

    review.sellerResponse.message = message.trim();
    review.sellerResponse.updatedAt = new Date();

    await review.save();

    res.json({
      message: 'Response updated successfully',
      review,
    });
  } catch (error) {
    console.error('Error updating review response:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Hide a review (similar to eBay's hide review feature)
 */
exports.hideReview = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (review.status === 'hidden') {
      return res.status(400).json({ message: 'Review is already hidden' });
    }

    review.status = 'hidden';
    await review.save();

    res.json({
      message: 'Review hidden successfully',
      review,
    });
  } catch (error) {
    console.error('Error hiding review:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Unhide a review
 */
exports.unhideReview = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (review.status !== 'hidden') {
      return res.status(400).json({ message: 'Review is not hidden' });
    }

    review.status = 'published';
    await review.save();

    res.json({
      message: 'Review unhidden successfully',
      review,
    });
  } catch (error) {
    console.error('Error unhiding review:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Report a review (for inappropriate content)
 */
exports.reportReview = async (req, res) => {
  try {
    const sellerId = req.sellerId;
    const { reviewId } = req.params;
    const { reason } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    review.isReported = true;
    review.reportedReason = reason || 'Inappropriate content';
    review.reportedAt = new Date();
    review.status = 'pending_moderation';

    await review.save();

    res.json({
      message: 'Review reported successfully. It will be reviewed by our team.',
      review,
    });
  } catch (error) {
    console.error('Error reporting review:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get review statistics for seller dashboard
 */
exports.getReviewStatistics = async (req, res) => {
  try {
    const sellerId = req.sellerId;

    const stats = await Review.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          ratingCounts: {
            $push: '$rating',
          },
          publishedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'published'] }, 1, 0] },
          },
          hiddenCount: {
            $sum: { $cond: [{ $eq: ['$status', 'hidden'] }, 1, 0] },
          },
          respondedCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ifNull: ['$sellerResponse.message', false] },
                    { $ne: ['$sellerResponse.message', ''] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          recentReviews: {
            $sum: {
              $cond: [
                {
                  $gte: [
                    '$reviewDate',
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const statistics = stats[0] || {
      totalReviews: 0,
      averageRating: 0,
      ratingCounts: [],
      publishedCount: 0,
      hiddenCount: 0,
      respondedCount: 0,
      recentReviews: 0,
    };

    // Calculate rating distribution
    const ratingDistribution = {
      5: statistics.ratingCounts.filter((r) => r === 5).length,
      4: statistics.ratingCounts.filter((r) => r === 4).length,
      3: statistics.ratingCounts.filter((r) => r === 3).length,
      2: statistics.ratingCounts.filter((r) => r === 2).length,
      1: statistics.ratingCounts.filter((r) => r === 1).length,
    };

    const responseRate =
      statistics.totalReviews > 0
        ? (statistics.respondedCount / statistics.totalReviews) * 100
        : 0;

    res.json({
      totalReviews: statistics.totalReviews,
      averageRating: statistics.averageRating
        ? Number(statistics.averageRating.toFixed(2))
        : 0,
      ratingDistribution,
      publishedCount: statistics.publishedCount,
      hiddenCount: statistics.hiddenCount,
      respondedCount: statistics.respondedCount,
      responseRate: Number(responseRate.toFixed(1)),
      recentReviews: statistics.recentReviews,
    });
  } catch (error) {
    console.error('Error fetching review statistics:', error);
    res.status(500).json({ message: error.message });
  }
};

