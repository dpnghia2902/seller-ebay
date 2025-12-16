const Order = require('../models/Order');
const SellerProfile = require('../models/SellerProfile');

/**
 * Get orders for a seller with filters
 * Query params:
 * - status: filter by order status
 * - startDate, endDate: filter by purchase date range
 * - search: search by buyer username or order number
 * - page, limit: pagination
 */
exports.getSellerOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const { status, startDate, endDate, search, page = 1, limit = 20, sortBy = 'purchaseDate', sortOrder = 'desc' } = req.query;

    // Find seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    // Build query
    const query = { sellerId: sellerProfile._id };

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.purchaseDate = {};
      if (startDate) {
        query.purchaseDate.$gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the end date
        const endDateTime = new Date(endDate);
        endDateTime.setHours(23, 59, 59, 999);
        query.purchaseDate.$lte = endDateTime;
      }
    }

    // Search by buyer username or order number
    if (search && search.trim()) {
      query.$or = [
        { buyerUsername: { $regex: search, $options: 'i' } },
        { buyerName: { $regex: search, $options: 'i' } },
        { orderNumber: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    if (sortBy === 'total') {
      sortObj['pricing.total'] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('buyerId', 'name email')
        .populate('listingId', 'title')
        .lean(),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get order details by ID
 */
exports.getOrderById = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;

    // Find seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    // Find order
    const order = await Order.findOne({
      _id: orderId,
      sellerId: sellerProfile._id,
    })
      .populate('buyerId', 'name email')
      .populate('listingId')
      .populate('storeId')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update order status
 */
exports.updateOrderStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { status, tracking, sellerNotes } = req.body;

    // Find seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    // Find and update order
    const order = await Order.findOne({
      _id: orderId,
      sellerId: sellerProfile._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    if (status) {
      order.status = status;
      
      // Auto-update payment status for certain order statuses
      if (status === 'delivered') {
        order.paymentStatus = 'paid';
        if (!order.paymentDate) {
          order.paymentDate = new Date();
        }
        if (tracking && !order.tracking.actualDelivery) {
          order.tracking.actualDelivery = new Date();
        }
      } else if (status === 'shipped' && !order.tracking.shippedDate) {
        order.tracking.shippedDate = new Date();
      }
    }

    // Update tracking info
    if (tracking) {
      order.tracking = { ...order.tracking, ...tracking };
    }

    // Update seller notes
    if (sellerNotes !== undefined) {
      order.sellerNotes = sellerNotes;
    }

    await order.save();

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Add tracking information to order
 */
exports.addTracking = async (req, res) => {
  try {
    const userId = req.userId;
    const { orderId } = req.params;
    const { carrier, trackingNumber, estimatedDelivery } = req.body;

    // Find seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    // Find and update order
    const order = await Order.findOne({
      _id: orderId,
      sellerId: sellerProfile._id,
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.tracking = {
      ...order.tracking,
      carrier,
      trackingNumber,
      shippedDate: new Date(),
      estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
    };

    // Update status to shipped if not already
    if (order.status === 'awaiting_shipment') {
      order.status = 'shipped';
    }

    await order.save();

    res.json({ message: 'Tracking added successfully', order });
  } catch (error) {
    console.error('Error adding tracking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get order statistics for seller dashboard
 */
exports.getOrderStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Find seller profile
    const sellerProfile = await SellerProfile.findOne({ userId });
    if (!sellerProfile) {
      return res.status(403).json({ message: 'Seller profile not found' });
    }

    const stats = await Order.aggregate([
      { $match: { sellerId: sellerProfile._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
        },
      },
    ]);

    const totalOrders = await Order.countDocuments({ sellerId: sellerProfile._id });
    const totalRevenue = await Order.aggregate([
      { $match: { sellerId: sellerProfile._id, paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.total' } } },
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusBreakdown: stats,
    });
  } catch (error) {
    console.error('Error fetching order stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

