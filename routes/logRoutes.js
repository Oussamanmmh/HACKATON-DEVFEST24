// routes/logRoutes.js

const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Fetch all logs
router.get('/', logController.getAllLogs);

// Fetch logs by machine ID
router.get('/:machine_id', logController.getLogsByMachineId);

module.exports = router;
