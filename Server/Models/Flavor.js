const mongoose = require("mongoose");

const flavorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Flavor name (e.g., "Blue Raspberry")
  createdAt: { type: Date, default: Date.now } // Timestamp for tracking
});

module.exports = mongoose.model("Flavor", flavorSchema);
