const express = require("express");
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, taskController.createTask);
router.get(
  "/tasks/user/:userId",
  authenticateToken,
  taskController.getTasksByUserId
);

router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id", taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.patch("/tasks/:id/mark-done", taskController.markTaskAsDone);

module.exports = router;
