const mongoose = require("mongoose");

const PaintingRobotSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  spray_pressure: Number,
  paint_thickness: Number,
  arm_position: {
    x: Number,
    y: Number,
    z: Number,
  },
  temperature: Number,
  humidity: Number,
  paint_flow_rate: Number,
  paint_volume_used: Number,
  atomizer_speed: Number,
  overspray_capture_efficiency: Number,
  booth_airflow_velocity: Number,
  solvent_concentration: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaintingRobot", PaintingRobotSchema);
