const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/blogController');
const { uploadBlogMedia } = require('../Middleware/blogUpload');
const { authenticateToken } = require('../Middleware/auth');
const { isAdmin } = require('../Middleware/adminAuth');

// Public routes
// GET /api/v1/blogs - Get all published blogs (with optional category filter)
router.get('/', blogController.getAllBlogs);

// GET /api/v1/blogs/categories - Get all categories with count
router.get('/categories', blogController.getBlogCategories);

// GET /api/v1/blogs/:id - Get single blog by ID or slug
router.get('/:id', blogController.getBlogById);

// Admin routes (require authentication and admin privileges)
// POST /api/v1/blogs - Create new blog
router.post(
  '/',
  authenticateToken,
  isAdmin,
  uploadBlogMedia,
  blogController.createBlog
);

// PUT /api/v1/blogs/:id - Update blog
router.put(
  '/:id',
  authenticateToken,
  isAdmin,
  uploadBlogMedia,
  blogController.updateBlog
);

// DELETE /api/v1/blogs/:id - Delete blog
router.delete(
  '/:id',
  authenticateToken,
  isAdmin,
  blogController.deleteBlog
);

// PATCH /api/v1/blogs/:id/toggle-published - Toggle published status
router.patch(
  '/:id/toggle-published',
  authenticateToken,
  isAdmin,
  blogController.togglePublished
);

module.exports = router;
