const express = require("express");
const router = express.Router();

const weldingRobotController = require("../controllers/weldingRobotController");
const stampingPressController = require("../controllers/stampingPressController");
const paintingRobotController = require("../controllers/paintingRobotController");
const agvController = require("../controllers/agvController");
const cncController = require("../controllers/cncController");
const leakTestController = require("../controllers/leakTestController");

// Define routes for each machine type
router.post("/welding-robot", weldingRobotController.receiveData);
router.get("/welding-robot", weldingRobotController.getData);


router.post("/stamping-press", stampingPressController.receiveData);
router.get("/stamping-press", stampingPressController.getData);


router.post("/painting-robot", paintingRobotController.receiveData);
router.get("/painting-robot", paintingRobotController.getData);


router.post("/agv", agvController.receiveData);
router.get("/agv", agvController.getData);


router.post("/cnc-machine", cncController.receiveData);
router.get("/cnc-machine", cncController.getData);


router.post("/leak-test", leakTestController.receiveData);
router.get("/leak-test", leakTestController.getData);


module.exports = router;
