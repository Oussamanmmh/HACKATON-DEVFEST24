// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true }, // e.g., "Critical Machine Alert"
    message: { type: String, required: true }, // Detailed message of the notification
    isRead: { type: Boolean, default: false }, // Whether the user has read the notification
    machineId: { type: String, required: false }, // Machine related to the notification (optional)
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: false }, // Related task (optional)
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
