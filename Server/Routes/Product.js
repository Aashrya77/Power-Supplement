const express = require('express');
const router = express.Router();
const productController = require('../Controllers/Product');
const { authenticateToken } = require('../Middleware/auth');
const upload = require('../Middleware/upload');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProduct);

// Protected routes (require authentication)
router.post('/', authenticateToken, upload.array('images', 5), productController.createProduct);
router.put('/:id', authenticateToken, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', authenticateToken, productController.deleteProduct);
router.patch('/:id/stock', authenticateToken, productController.updateStock);
router.patch('/:id/price', authenticateToken, productController.updatePrice);


router.patch('/:id/img', authenticateToken, productController.updateProduct)

router.delete('/:id', authenticateToken, productController.deleteProduct);



module.exports = router;