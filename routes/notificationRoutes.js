const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/notifications", notificationController.createNotification);

router.get("/notifications", notificationController.getAllNotifications);

router.get(
  "/notifications/user/:userId",
  notificationController.getNotificationsByUserId
);

router.put("/notifications/:id/read", notificationController.markAsRead);

router.delete("/notifications/:id", notificationController.deleteNotification);

module.exports = router;
