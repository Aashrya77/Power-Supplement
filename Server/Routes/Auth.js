const express = require('express');
const router = express.Router();
const authController = require('../Controllers/Auth');
const { authenticateToken } = require('../Middleware/auth');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/me', authenticateToken, authController.getCurrentUser);
router.get('/verify', authController.verifyAuth);

module.exports = router;
