const express = require("express");
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, taskController.createTask);
router.get("/tasks", authenticateToken, taskController.getAllTasks);
router.get("/tasks/:id", authenticateToken, taskController.getTaskById);
router.put("/tasks/:id", authenticateToken, taskController.updateTask);
router.delete("/tasks/:id", authenticateToken, taskController.deleteTask);
router.patch(
  "/tasks/:id/mark-done",
  authenticateToken,
  taskController.markTaskAsDone
);

module.exports = router;
