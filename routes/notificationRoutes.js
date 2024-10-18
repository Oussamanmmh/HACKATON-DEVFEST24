const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateToken } = require("../middleware/authMiddleware");

// Existing notification routes
router.post("/", authenticateToken, notificationController.createNotification);
router.get(
  "/:userId",
  authenticateToken,
  notificationController.getNotificationsByUserId
);
router.get("/", notificationController.getAllNotifications);
router.put("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

// New route for getting notifications of the current user based on the token
router.get(
  "/current-user",
  authenticateToken,
  notificationController.getNotificationsForCurrentUser
);

module.exports = router;
