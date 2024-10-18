// models/PaintingRobotThreshold.js
const mongoose = require("mongoose");

const paintingRobotSchema = new mongoose.Schema({
  machine_id: { type: String, required: false, unique: true , default: "painting_robot_002"},
  spray_pressure: {
    worker: { type: Number, default: 3.0, required: false },
    manager: { type: Number, default: 4.0, required: false },
  },
  paint_thickness: {
    worker: { type: Number, default: 110, required: false },
    manager: { type: Number, default: 140, required: false },
  },
  humidity: {
    worker: { type: Number, default: 50, required: false },
    manager: { type: Number, default: 70, required: false },
  },
  paint_flow_rate: {
    worker: { type: Number, default: 3.5, required: false },
    manager: { type: Number, default: 5.0, required: false },
  },
  atomizer_speed: {
    worker: { type: Number, default: 18000, required: false },
    manager: { type: Number, default: 22000, required: false },
  },
  overspray_capture_efficiency: {
    worker: { type: Number, default: 90, required: false },
    manager: { type: Number, default: 95, required: false },
  },
  booth_airflow_velocity: {
    worker: { type: Number, default: 0.4, required: false },
    manager: { type: Number, default: 0.6, required: false },
  },
  solvent_concentration: {
    worker: { type: Number, default: 5, required: false },
    manager: { type: Number, default: 10, required: false },
  },
});

const PaintingRobotThreshold = mongoose.model(
  "PaintingRobotThreshold",
  paintingRobotSchema
);

module.exports = PaintingRobotThreshold;
