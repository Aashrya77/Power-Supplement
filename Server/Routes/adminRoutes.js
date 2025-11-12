const express = require('express');
const router = express.Router();
const { 
    getAllOrders, 
    getDashboardStats,
    updateOrderStatusAdmin
} = require('../Controllers/adminController');
const { authenticateToken } = require('../Middleware/auth');

// Get all orders (admin only)
router.get('/orders', authenticateToken, getAllOrders);

// Get dashboard statistics (admin only)
router.get('/stats', authenticateToken, getDashboardStats);

// Update order status (admin only)
router.patch('/orders/:orderId', authenticateToken, updateOrderStatusAdmin);

module.exports = router;
