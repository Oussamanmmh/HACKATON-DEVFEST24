// models/CNCMillingThreshold.js
const mongoose = require("mongoose");

const cncMillingSchema = new mongoose.Schema({
  machine_id: {
    type: String,
    required: false,
    unique: true,
    default: "cnc_milling_004",
  },
  spindle_speed: {
    worker: { type: Number, default: 11000, required: false },
    manager: { type: Number, default: 13000, required: false },
  },
  vibration_level: {
    worker: { type: Number, default: 1.0, required: false },
    manager: { type: Number, default: 1.5, required: false },
  },
  power_consumption: {
    worker: { type: Number, default: 9.0, required: false },
    manager: { type: Number, default: 12.0, required: false },
  },
  tool_wear_level: {
    worker: { type: Number, default: 30, required: false },
    manager: { type: Number, default: 50, required: false },
  },
  cut_depth: {
    worker: { type: Number, default: 4, required: false },
    manager: { type: Number, default: 6, required: false },
  },
  coolant_flow_rate: {
    worker: { type: Number, default: 0.7, required: false },
    manager: { type: Number, default: 1.0, required: false },
  },
  material_hardness: {
    worker: { type: Number, default: 200, required: false },
    manager: { type: Number, default: 250, required: false },
  },
  chip_load: {
    worker: { type: Number, default: 0.3, required: false },
    manager: { type: Number, default: 0.5, required: false },
  },
});

const CNCMillingThreshold = mongoose.model(
  "CNCMillingThreshold",
  cncMillingSchema
);

module.exports = CNCMillingThreshold;
