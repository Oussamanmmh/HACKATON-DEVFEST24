// routes/taskSchedulerRoutes.js
const express = require("express");
const router = express.Router();
const taskSchedulerController = require("../controllers/taskSchedulerController");
const energyController = require("../controllers/EnergyConsumptionController");

// Route to generate the task schedule
router.post(
  "/generate-task-schedule",
  taskSchedulerController.generateTaskSchedule
);

// Route to generate the energy summary using LLM
router.get("/energy-summary", energyController.generateEnergySummary);

module.exports = router;
