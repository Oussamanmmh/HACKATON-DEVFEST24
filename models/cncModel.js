const mongoose = require("mongoose");

const CNCMachineSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  spindle_speed: Number,
  tool_wear_level: Number,
  cut_depth: Number,
  feed_rate: Number,
  vibration_level: Number,
  coolant_flow_rate: Number,
  material_hardness: Number,
  power_consumption: Number,
  temperature: Number,
  chip_load: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CNCMachine", CNCMachineSchema);
