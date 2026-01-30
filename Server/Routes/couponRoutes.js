const express = require('express');
const router = express.Router();
const couponController = require('../Controllers/couponController');
const { authenticateToken } = require('../Middleware/auth');

// Customer routes (must be authenticated)
router.use(authenticateToken);

// Customer can validate and view available coupons
router.post('/validate', couponController.validateCouponForCustomer);
router.get('/available', couponController.getAvailableCoupons);

// Admin routes (must be admin)
// Admin check will be done in controller functions

router
  .route('/')
  .get(couponController.getAllCoupons)
  .post(couponController.createCoupon);

router
  .route('/:id')
  .get(couponController.getCoupon)
  .patch(couponController.updateCoupon)
  .delete(couponController.deleteCoupon);

router.patch('/:id/toggle-status', couponController.toggleCouponStatus);
router.get('/:id/stats', couponController.getCouponStats);

module.exports = router;
