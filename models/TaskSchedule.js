// models/TaskSchedule.js
const mongoose = require("mongoose");

const taskScheduleSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  action: { type: String, required: true },
  scheduled_date: { type: Date, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  worker_role: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TaskSchedule", taskScheduleSchema);
