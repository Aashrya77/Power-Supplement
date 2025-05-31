const express = require('express');
const router = express.Router();
const paymentController = require('../Controllers/paymentController');
const { authenticateToken } = require('../Middleware/auth');

// Initiate payment
router.post('/initiate', authenticateToken, paymentController.initiatePayment);

// Verify payment after redirection from eSewa
router.post('/verify', paymentController.verifyPayment);

// Check payment status
router.get('/status', authenticateToken, paymentController.checkPaymentStatus);

module.exports = router;
