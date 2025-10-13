const Blog = require('../Models/Blog');
const fs = require('fs');
const path = require('path');

// Get all published blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, page = 1, limit = 10, sort = '-date' } = req.query;
    const skip = (page - 1) * limit;
    
    // Base query - only published blogs
    let query = { published: true };
    
    // Apply category filter if present
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Get total count for pagination
    const total = await Blog.countDocuments(query);
    
    // Fetch blogs with pagination and sorting
    const blogs = await Blog
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // Exclude full content for list view
    
    res.status(200).json({
      success: true,
      blogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalBlogs: total
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
};

// Get single blog by ID or slug
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID first, then by slug
    let blog = await Blog.findById(id);
    
    if (!blog) {
      blog = await Blog.findOne({ slug: id, published: true });
    }
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment views
    blog.views += 1;
    await blog.save();
    
    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
};

// Create new blog (admin only)
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      author,
      readTime,
      mediaType,
      published
    } = req.body;
    
    // Validate required fields
    if (!title || !excerpt || !content || !category || !mediaType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Prepare blog data
    const blogData = {
      title,
      excerpt,
      content,
      category,
      author: author || 'Power Team',
      readTime: readTime || '5 min read',
      mediaType,
      published: published !== undefined ? published : true
    };
    
    // Handle file uploads
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        blogData.imageUrl = `/uploads/blogs/${req.files.image[0].filename}`;
      }
      if (req.files.video && req.files.video[0]) {
        blogData.videoUrl = `/uploads/blogs/${req.files.video[0].filename}`;
      }
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        blogData.thumbnail = `/uploads/blogs/${req.files.thumbnail[0].filename}`;
      }
    }
    
    // Validate media type requirements
    if (mediaType === 'image' && !blogData.imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image is required when media type is image'
      });
    }
    
    if (mediaType === 'video' && !blogData.videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video is required when media type is video'
      });
    }
    
    // Create blog
    const blog = new Blog(blogData);
    await blog.save();
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    
    // Clean up uploaded files on error
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          const filePath = path.join(__dirname, '..', file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
};

// Update blog (admin only)
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Find existing blog
    const existingBlog = await Blog.findById(id);
    
    if (!existingBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Handle file uploads for update
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        // Delete old image if exists
        if (existingBlog.imageUrl) {
          const oldImagePath = path.join(__dirname, '..', existingBlog.imageUrl);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        updateData.imageUrl = `/uploads/blogs/${req.files.image[0].filename}`;
      }
      
      if (req.files.video && req.files.video[0]) {
        // Delete old video if exists
        if (existingBlog.videoUrl) {
          const oldVideoPath = path.join(__dirname, '..', existingBlog.videoUrl);
          if (fs.existsSync(oldVideoPath)) {
            fs.unlinkSync(oldVideoPath);
          }
        }
        updateData.videoUrl = `/uploads/blogs/${req.files.video[0].filename}`;
      }
      
      if (req.files.thumbnail && req.files.thumbnail[0]) {
        // Delete old thumbnail if exists
        if (existingBlog.thumbnail) {
          const oldThumbnailPath = path.join(__dirname, '..', existingBlog.thumbnail);
          if (fs.existsSync(oldThumbnailPath)) {
            fs.unlinkSync(oldThumbnailPath);
          }
        }
        updateData.thumbnail = `/uploads/blogs/${req.files.thumbnail[0].filename}`;
      }
    }
    
    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    
    // Clean up newly uploaded files on error
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          const filePath = path.join(__dirname, '..', file.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error updating blog',
      error: error.message
    });
  }
};

// Delete blog (admin only)
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find blog
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Delete associated files
    if (blog.imageUrl) {
      const imagePath = path.join(__dirname, '..', blog.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (blog.videoUrl) {
      const videoPath = path.join(__dirname, '..', blog.videoUrl);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    if (blog.thumbnail) {
      const thumbnailPath = path.join(__dirname, '..', blog.thumbnail);
      if (fs.existsSync(thumbnailPath)) {
        fs.unlinkSync(thumbnailPath);
      }
    }
    
    // Delete blog from database
    await Blog.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message
    });
  }
};

// Get blog categories with count
exports.getBlogCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Toggle blog published status (admin only)
exports.togglePublished = async (req, res) => {
  try {
    const { id } = req.params;
    
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    blog.published = !blog.published;
    await blog.save();
    
    res.status(200).json({
      success: true,
      message: `Blog ${blog.published ? 'published' : 'unpublished'} successfully`,
      blog
    });
  } catch (error) {
    console.error('Error toggling published status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog status',
      error: error.message
    });
  }
};
