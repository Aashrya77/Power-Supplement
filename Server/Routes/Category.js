const express = require('express');
const router = express.Router();
const categoryController = require('../Controllers/Category');
const { authenticateToken } = require('../Middleware/auth');
const { isAdmin } = require('../Middleware/adminAuth');

// Public routes - anyone can view categories
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategory);
router.get('/:id/products', categoryController.getCategoryProducts);

// Admin only routes - protected with both authentication and admin check
router.post('/', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

module.exports = router;