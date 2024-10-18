// models/StampingPressThreshold.js
const mongoose = require("mongoose");

const stampingPressSchema = new mongoose.Schema({
  machine_id: { type: String, required: false, unique: true , default: "stamping_press_001"},
  temperature: {
    worker: { type: Number, default: 70, required: false },
    manager: { type: Number, default: 90, required: false },
  },
  vibration_level: {
    worker: { type: Number, default: 0.7, required: false },
    manager: { type: Number, default: 1.5, required: false },
  },
  power_consumption: {
    worker: { type: Number, default: 10.0, required: false },
    manager: { type: Number, default: 15.0, required: false },
  },
  force_applied: {
    worker: { type: Number, default: 450, required: false },
    manager: { type: Number, default: 550, required: false },
  },
  cycle_time: {
    worker: { type: Number, default: 14, required: false },
    manager: { type: Number, default: 18, required: false },
  },
  oil_pressure: {
    worker: { type: Number, default: 3.2, required: false },
    manager: { type: Number, default: 4.0, required: false },
  },
  noise_level: {
    worker: { type: Number, default: 80, required: false },
    manager: { type: Number, default: 90, required: false },
  },
  sheet_thickness: {
    worker: { type: Number, default: 1.1, required: false },
    manager: { type: Number, default: 1.5, required: false },
  },
});

const StampingPressThreshold = mongoose.model(
  "StampingPressThreshold",
  stampingPressSchema
);

module.exports = StampingPressThreshold;
