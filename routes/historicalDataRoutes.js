// routes/historicalDataRoutes.js

const express = require('express');
const router = express.Router();
const historicalDataController = require('../controllers/historicalDataController');

// Historical Data Endpoints for Each Machine
router.get('/welding-robot', historicalDataController.getWeldingRobotData);
router.get('/stamping-press', historicalDataController.getStampingPressData);
router.get('/painting-robot', historicalDataController.getPaintingRobotData);
router.get('/agv', historicalDataController.getAGVData);
router.get('/cnc-machine', historicalDataController.getCNCMachineData);
router.get('/leak-test', historicalDataController.getLeakTestData);

module.exports = router;
