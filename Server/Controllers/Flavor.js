const Flavor = require('../Models/Flavor');
const Product = require('../Models/Product');

// Get all flavors
exports.getAllFlavors = async (req, res) => {
  try {
    const flavors = await Flavor.find();
    res.status(200).json(flavors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flavors', error: error.message });
  }
};

// Get single flavor
exports.getFlavor = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    if (!flavor) {
      return res.status(404).json({ message: 'Flavor not found' });
    }
    res.status(200).json(flavor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flavor', error: error.message });
  }
};

// Create new flavor
exports.createFlavor = async (req, res) => {
  try {
    const newFlavor = new Flavor(req.body);
    const savedFlavor = await newFlavor.save();
    res.status(201).json(savedFlavor);
  } catch (error) {
    res.status(400).json({ message: 'Error creating flavor', error: error.message });
  }
};

// Update flavor
exports.updateFlavor = async (req, res) => {
  try {
    const updatedFlavor = await Flavor.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    if (!updatedFlavor) {
      return res.status(404).json({ message: 'Flavor not found' });
    }
    res.status(200).json(updatedFlavor);
  } catch (error) {
    res.status(400).json({ message: 'Error updating flavor', error: error.message });
  }
};

// Delete flavor
exports.deleteFlavor = async (req, res) => {
  try {
    // Check if flavor is being used by any products
    const productsWithFlavor = await Product.findOne({ flavors: req.params.id });
    if (productsWithFlavor) {
      return res.status(400).json({ 
        message: 'Cannot delete flavor that is associated with products'
      });
    }

    const deletedFlavor = await Flavor.findByIdAndDelete(req.params.id);
    if (!deletedFlavor) {
      return res.status(404).json({ message: 'Flavor not found' });
    }
    res.status(200).json({ message: 'Flavor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting flavor', error: error.message });
  }
};

// Get products by flavor
exports.getFlavorProducts = async (req, res) => {
  try {
    const products = await Product.find({ flavors: req.params.id })
      .populate('category')
      .populate('flavors');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flavor products', error: error.message });
  }
};