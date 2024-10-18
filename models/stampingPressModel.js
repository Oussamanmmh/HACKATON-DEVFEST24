const mongoose = require("mongoose");

const StampingPressSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  force_applied: Number,
  cycle_time: Number,
  temperature: Number,
  vibration_level: Number,
  cycle_count: Number,
  oil_pressure: Number,
  die_alignment: String,
  sheet_thickness: Number,
  power_consumption: Number,
  noise_level: Number,
  lubrication_flow_rate: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("StampingPress", StampingPressSchema);
