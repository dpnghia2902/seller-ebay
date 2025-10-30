const Order = require('../models/orderModel');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('buyer_id store_id items.product_id');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      id,
      { status, updated_at: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Giả lập in phiếu vận chuyển
exports.printShippingLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const label = `
==== SHIPPING LABEL ====
Order ID: ${order._id}
Buyer: ${order.buyer_id}
Store: ${order.store_id}
Total: ${order.total_amount}
Status: ${order.status}
========================
    `;
    res.json({ label });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
