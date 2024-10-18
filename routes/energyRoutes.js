const express = require("express");
const router = express.Router();
const energyController = require("../controllers/energyController");

// Get all energy logs
router.get("/", energyController.getAllEnergyLogs);

// Get energy logs by machine ID
router.get("/:machine_id", energyController.getEnergyByMachineId);

module.exports = router;
