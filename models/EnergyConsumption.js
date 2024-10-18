const mongoose = require("mongoose");

const energyConsumptionSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  energy: { type: Number, required: true }, // Total energy consumed
  shift: {
    type: String,
    enum: ["Morning", "Afternoon", "Night"],
    required: true,
  }, // Shift info
  timestamp: { type: Date, default: Date.now }, // When the energy was logged
});

module.exports = mongoose.model("EnergyConsumption", energyConsumptionSchema);
