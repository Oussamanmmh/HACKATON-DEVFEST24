const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Create a new user
router.post("/users", userController.createUser);

// Get a user by ID
router.get("/users/:userId", userController.getUserById);

// Get all users
router.get("/users", userController.getAllUsers);

// Update a user by ID
router.put("/users/:userId", userController.updateUser);

// Delete a user by ID
router.delete("/users/:userId", userController.deleteUser);

// Get user tasks by user ID
router.get("/users/:userId/tasks", userController.getUserTasks);

// Get user notifications by user ID
router.get("/users/:userId/notifications", userController.getUserNotifications);

// Change user password
router.put("/users/:userId/password", userController.changeUserPassword);

module.exports = router;
