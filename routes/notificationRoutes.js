// routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Route for creating a notification
router.post("/notifications", notificationController.createNotification);

// Route for getting all notifications
router.get("/notifications", notificationController.getAllNotifications);

// Route for getting notifications by user ID
router.get("/notifications/user/:userId", notificationController.getNotificationsByUserId);

// Route for marking a notification as read
router.put("/notifications/:id/read", notificationController.markAsRead);

// Route for deleting a notification
router.delete("/notifications/:id", notificationController.deleteNotification);

module.exports = router;
