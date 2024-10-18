const express = require("express");
const taskController = require("../controllers/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", authenticateToken, taskController.createTask);
router.get("/user/:userId", authenticateToken, taskController.getTasksByUserId);

router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);
router.patch("/:id/mark-done", taskController.markTaskAsDone);

module.exports = router;
