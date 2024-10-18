// routes/taskSchedulerRoutes.js
const express = require("express");
const router = express.Router();
const taskSchedulerController = require("../controllers/taskSchedulerController");

// Route to generate the task schedule
router.post(
  "/generate-task-schedule",
  taskSchedulerController.generateTaskSchedule
);

module.exports = router;
