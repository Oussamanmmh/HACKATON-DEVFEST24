const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/users", userController.createUser);

router.get("/users/:userId", authenticateToken, userController.getUserById);

router.get("/users", userController.getAllUsers);

router.put("/users/:userId", authenticateToken, userController.updateUser);

router.delete("/users/:userId", authenticateToken, userController.deleteUser);

router.get(
  "/users/:userId/tasks",
  authenticateToken,
  userController.getUserTasks
);

router.get(
  "/users/:userId/notifications",
  authenticateToken,
  userController.getUserNotifications
);

router.put(
  "/users/:userId/password",
  authenticateToken,
  userController.changeUserPassword
);

module.exports = router;
