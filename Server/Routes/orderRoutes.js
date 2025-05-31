const express = require('express');
const router = express.Router();
const { 
    createOrder, 
    getOrderById, 
    getUserOrders, 
    updateOrderStatus 
} = require('../Controllers/orderController');
const { authenticateToken } = require('../Middleware/auth');

// Create a new order
router.post('/', authenticateToken, createOrder);

// Get order by ID
router.get('/:orderId', authenticateToken, getOrderById);

// Get all orders for a user
router.get('/', authenticateToken, getUserOrders);

// Update order status
router.patch('/:orderId', authenticateToken, updateOrderStatus);

module.exports = router;
