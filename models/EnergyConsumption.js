const mongoose = require("mongoose");

const energyConsumptionSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  energy: { type: Number, required: true },
  shift: {
    type: String,
    enum: ["Morning", "Afternoon", "Night"],
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EnergyConsumption", energyConsumptionSchema);
