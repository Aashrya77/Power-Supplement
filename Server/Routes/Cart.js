const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../Middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon
} = require('../Controllers/Cart');

// All cart routes require authentication
router.use(authenticateToken);

// Get cart
router.get('/', getCart);

// Add to cart
router.post('/add', addToCart);

// Update cart item
router.put('/update', updateCartItem);

// Remove from cart
router.delete('/remove/:productId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

// Apply coupon
router.post('/coupon', applyCoupon);

module.exports = router;