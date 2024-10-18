const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post(
  "/notifications",
  authenticateToken,
  notificationController.createNotification
);
router.get(
  "/notifications/user/:userId",
  authenticateToken,
  notificationController.getNotificationsByUserId
);

router.get("/notifications", notificationController.getAllNotifications);
router.put("/notifications/:id/read", notificationController.markAsRead);
router.delete("/notifications/:id", notificationController.deleteNotification);

module.exports = router;
