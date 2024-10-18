const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model
      required: false,
    },
    taskTitle: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    scheduledDate: {
      type: Date, // Date when the task is scheduled
      required: false,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    taskType: {
      type: String,
      enum: ["maintenance", "monitoring", "alert", "other"],
      default: "alert", // You can expand this based on task types
    },
    machineData: {
      machine_id: { type: String, required: false }, // Machine that triggered the task
      machineType: { type: String, required: false }, // Type of the machine (e.g., welding_robot, agv, etc.)
      sensorData: { type: mongoose.Schema.Types.Mixed, required: false }, // Store sensor data, can be different for each machine
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Pre-save middleware to update the `updatedAt` timestamp
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
