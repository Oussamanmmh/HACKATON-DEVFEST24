const mongoose = require("mongoose");

const AGVSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  location: {
    x: Number,
    y: Number,
    z: Number,
  },
  battery_level: Number,
  load_weight: Number,
  speed: Number,
  distance_traveled: Number,
  obstacle_detection: String,
  navigation_status: String,
  vibration_level: Number,
  temperature: Number,
  wheel_rotation_speed: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AGV", AGVSchema);
