const Product = require('../Models/Product');
const mongoose = require('mongoose');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, page = 1, limit = 9, sort } = req.query;
    const skip = (page - 1) * limit;
    
    // Base query
    let query = Product.find()

    // Apply category filter if present
    if (category) {
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ message: 'Invalid category ID format' });
      }
      query = query.where('category', category);
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Apply sorting
    if (sort === 'random') {
      // For random sorting, we'll use a different approach
      const randomProducts = await Product
        .aggregate([
          { $sample: { size: parseInt(limit) } }
        ])
        .exec();

      // Get the IDs of random products
      const productIds = randomProducts.map(p => p._id);

      // Fetch the complete products with populated fields
      const products = await Product
        .find({ _id: { $in: productIds } })
        .populate('category')
        .populate('flavors');
        
      return res.status(200).json({
        products,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      });
    } else {
      // Normal sorting
      switch (sort) {
        case 'price':
          query = query.sort({ price: 1 });
          break;
        case '-price':
          query = query.sort({ price: -1 });
          break;
        case 'name':
          query = query.sort({ name: 1 });
          break;
        default:
          query = query.sort({ createdAt: -1 });
      }

      // Get paginated products
      const products = await query
        .populate('category')
        .populate('flavors')
        .skip(skip)
        .limit(parseInt(limit))
        .exec()
      

      res.status(200).json({
        products,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ 
      message: 'Error fetching products', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category')
      .populate('flavors');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const productData = { ...req.body };
    
    // Handle flavor IDs - ensure it's an array
    if (typeof productData.flavors === 'string') {
      try {
        productData.flavors = JSON.parse(productData.flavors);
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid flavors format. Please provide an array of flavor IDs.',
          error: e.message 
        });
      }
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Set stockStatus based on stock quantity if not provided
    if (!productData.stockStatus) {
      productData.stockStatus = productData.stock > 0 ? "In Stock" : "Out of Stock";
    } else {
      // Validate stockStatus if provided
      const validStatuses = ["In Stock", "Out of Stock", "Coming Soon"];
      if (!validStatuses.includes(productData.stockStatus)) {
        return res.status(400).json({ 
          message: 'Invalid stock status. Must be one of: In Stock, Out of Stock, Coming Soon' 
        });
      }
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();
    
    // Populate the saved product with flavor details
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('category')
      .populate('flavors');
      
    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle flavor IDs - ensure it's an array
    if (typeof updateData.flavors === 'string') {
      try {
        updateData.flavors = JSON.parse(updateData.flavors);
      } catch (e) {
        return res.status(400).json({ 
          message: 'Invalid flavors format. Please provide an array of flavor IDs.',
          error: e.message 
        });
      }
    }

    // Handle image uploads for updates
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Validate stockStatus if provided
    if (updateData.stockStatus) {
      const validStatuses = ["In Stock", "Out of Stock", "Coming Soon"];
      if (!validStatuses.includes(updateData.stockStatus)) {
        return res.status(400).json({ 
          message: 'Invalid stock status. Must be one of: In Stock, Out of Stock, Coming Soon' 
        });
      }
    } else if (updateData.stock !== undefined) {
      // Update stockStatus based on stock if stock is being updated but stockStatus is not provided
      updateData.stockStatus = updateData.stock > 0 ? "In Stock" : "Out of Stock";
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate('category').populate('flavors');
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
};

// Update product price
exports.updatePrice = async (req, res) => {
  try {
    const { price } = req.body;
    
    // Validate price
    if (!price || typeof price !== 'number' || price < 0) {
      return res.status(400).json({ message: 'Invalid price. Price must be a positive number.' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { price } },
      { new: true }
    ).populate('category').populate('flavors');
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product price', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).populate('category').populate('flavors');
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error searching products', error: error.message });
  }
};

// Update product stock
exports.updateStock = async (req, res) => {
  try {
    const { stock, stockStatus } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update stock quantity if provided
    if (stock !== undefined) {
      product.stock = stock;
    }
    
    // Update stock status if provided
    if (stockStatus !== undefined) {
      // Validate that stockStatus is one of the allowed values
      const validStatuses = ["In Stock", "Out of Stock", "Coming Soon"];
      if (!validStatuses.includes(stockStatus)) {
        return res.status(400).json({ 
          message: 'Invalid stock status. Must be one of: In Stock, Out of Stock, Coming Soon' 
        });
      }
      product.stockStatus = stockStatus;
    } else {
      // Automatically set stockStatus based on quantity if not explicitly provided
      if (stock !== undefined) {
        product.stockStatus = stock > 0 ? "In Stock" : "Out of Stock";
      }
    }
    
    await product.save();
    
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating stock', error: error.message });
  }
};

