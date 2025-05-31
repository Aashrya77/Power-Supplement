const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Category name
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

module.exports = mongoose.model("Category", categorySchema);
