// routes/machineThresholdRoutes.js
const express = require("express");
const {
  getMachineThreshold,
  updateMachineThreshold,
} = require("../controllers/machineThresholdController");

const router = express.Router();

// Get thresholds for a specific machine
router.get("/:machine_id", getMachineThreshold);

// Update thresholds for a specific machine
router.put("/:machine_id", updateMachineThreshold);

module.exports = router;
