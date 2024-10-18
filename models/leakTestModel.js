const mongoose = require("mongoose");

const LeakTestSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  test_pressure: Number,
  pressure_drop: Number,
  leak_rate: Number,
  test_duration: Number,
  temperature: Number,
  status: String,
  fluid_type: String,
  seal_condition: String,
  test_cycle_count: Number,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LeakTest", LeakTestSchema);
