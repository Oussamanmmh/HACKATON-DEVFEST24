const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

// Create a new task
router.post("/tasks", taskController.createTask);

// Get all tasks
router.get("/tasks", taskController.getAllTasks);

// Get tasks by user ID
router.get("/tasks/user/:userId", taskController.getTasksByUserId); // New route to get tasks by user ID

// Get a specific task by ID
router.get("/tasks/:id", taskController.getTaskById);

// Update a specific task by ID
router.put("/tasks/:id", taskController.updateTask);

// Delete a specific task by ID
router.delete("/tasks/:id", taskController.deleteTask);

// Mark a task as done
router.patch("/tasks/:id/done", taskController.markTaskAsDone);

module.exports = router;
