const mongoose = require("mongoose");

const machineLogSchema = new mongoose.Schema({
  machine_id: { type: String, required: false },
  machineType: { type: String, required: false },
  sensorData: { type: Object, required: false },
  warnings: [{ type: String }],
  description: { type: String },
  status: { type: String, enum: ["normal", "warning", "danger"] },
  processed_at: { type: Date, default: Date.now },
  timestamp: { type: Date },
  task_assigned: { type: Boolean, default: false },
  additional_data: { type: Object },
});

module.exports = mongoose.model("MachineLog", machineLogSchema);
