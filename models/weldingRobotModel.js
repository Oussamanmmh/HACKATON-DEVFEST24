const mongoose = require("mongoose");

const WeldingRobotSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  weld_temperature: Number,
  weld_current: Number,
  weld_voltage: Number,
  weld_time: Number,
  pressure_applied: Number,
  arm_position: {
    x: Number,
    y: Number,
    z: Number,
  },
  wire_feed_rate: Number,
  gas_flow_rate: Number,
  weld_strength_estimate: Number,
  vibration_level: Number,
  power_consumption: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("WeldingRobot", WeldingRobotSchema);
