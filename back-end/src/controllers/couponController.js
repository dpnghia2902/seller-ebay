const Coupon = require('../models/couponModel');
const authenticateJWT = require('../auth/authMiddleware');

// Tạo voucher (CẦN JWT)
exports.createCoupon = [
  authenticateJWT,
  async (req, res) => {
    try {
      const coupon = new Coupon(req.body);
      await coupon.save();
      res.status(201).json(coupon);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];

// Lấy voucher theo ID (KHÔNG cần JWT)
exports.getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách voucher (KHÔNG cần JWT)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa voucher (CẦN JWT)
exports.deleteCoupon = [
  authenticateJWT,
  async (req, res) => {
    try {
      await Coupon.findByIdAndDelete(req.params.id);
      res.json({ message: 'Coupon deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
];
