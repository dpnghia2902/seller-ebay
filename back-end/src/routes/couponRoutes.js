const express = require('express');
const { createCoupon, getAllCoupons, deleteCoupon, getCouponById } = require('../controllers/couponController');
const router = express.Router();

router.post('/', createCoupon);
router.get('/', getAllCoupons);
router.get('/:id', getCouponById);
router.delete('/:id', deleteCoupon);

module.exports = router;
