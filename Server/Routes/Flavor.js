const express = require('express');
const router = express.Router();
const flavorController = require('../Controllers/Flavor');
const { authenticateToken } = require('../Middleware/auth');

// Public routes
router.get('/', flavorController.getAllFlavors);
router.get('/:id', flavorController.getFlavor);
router.get('/:id/products', flavorController.getFlavorProducts);

// Protected routes (require authentication)
router.post('/', authenticateToken, flavorController.createFlavor);
router.put('/:id', authenticateToken, flavorController.updateFlavor);
router.delete('/:id', authenticateToken, flavorController.deleteFlavor);

module.exports = router;