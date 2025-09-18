const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Product name
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  }, // Product category
  description: { type: String, required: true }, // Description of the product
  price: { type: Number, required: true }, // Price of the supplement
  stock: { type: Number, required: true, default: 0 }, // Available stock
  stockStatus: { 
    type: String, 
    enum: ["In Stock", "Out of Stock", "Coming Soon"], 
    default: "In Stock" 
  }, // Stock status
  flavors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flavor" }], // Available flavors
  images: [{ type: String }], // Store image URLs
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model("Product", productSchema);
