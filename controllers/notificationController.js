// controllers/notificationController.js
const Notification = require("../models/Notification");
const User = require("../models/User");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, machineId, taskId } = req.body;

    const newNotification = new Notification({
      userId,
      title,
      message,
      machineId,
      taskId,
    });

    await newNotification.save();

    // Optionally, push the notification to the user's notifications array
    await User.findByIdAndUpdate(userId, {
      $push: { notifications: newNotification._id },
    });

    res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get notifications by user ID
exports.getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notifications = await Notification.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notifications by user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findByIdAndDelete(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};
