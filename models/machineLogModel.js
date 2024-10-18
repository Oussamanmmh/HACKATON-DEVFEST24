// models/machineLogModel.js
const mongoose = require("mongoose");

const machineLogSchema = new mongoose.Schema({
  machine_id: { type: String, required: true }, // Machine ID (e.g., welding_robot_006)
  data: { type: Object, required: true }, // Raw data received from the machine
  warnings: [{ type: String }], // List of warnings (if any) generated during processing
  processed_at: { type: Date, default: Date.now }, // Timestamp when the data was processed
});

// Create the model from the schema
const MachineLog = mongoose.model("MachineLog", machineLogSchema);

module.exports = MachineLog;
