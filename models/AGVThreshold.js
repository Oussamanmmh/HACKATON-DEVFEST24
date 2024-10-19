// models/AGVThreshold.js
const mongoose = require("mongoose");

const agvSchema = new mongoose.Schema({
  machine_id: {
    type: String,
    required: false,
    unique: true,
    default: "agv_003",
  },
  battery_level: {
    worker: { type: Number, default: 30, required: false },
    manager: { type: Number, default: 20, required: false },
  },
  load_weight: {
    worker: { type: Number, default: 900, required: false },
    manager: { type: Number, default: 1100, required: false },
  },
  speed: {
    worker: { type: Number, default: 3, required: false },
    manager: { type: Number, default: 4, required: false },
  },
  distance_traveled: {
    worker: { type: Number, default: 1000, required: false },
    manager: { type: Number, default: 1500, required: false },
  },
  vibration_level: {
    worker: { type: Number, default: 0.3, required: false },
    manager: { type: Number, default: 0.5, required: false },
  },
  temperature: {
    worker: { type: Number, default: 32, required: false },
    manager: { type: Number, default: 40, required: false },
  },
  wheel_rotation_speed: {
    worker: { type: Number, default: 350, required: false },
    manager: { type: Number, default: 450, required: false },
  },
});

const AGVThreshold = mongoose.model("AGVThreshold", agvSchema);

module.exports = AGVThreshold;
