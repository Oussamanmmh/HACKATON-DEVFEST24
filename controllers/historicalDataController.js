// controllers/historicalDataController.js

const WeldingRobot = require("../models/weldingRobotModel");
const StampingPress = require("../models/stampingPressModel");
const PaintingRobot = require("../models/paintingRobotModel");
const AGV = require("../models/agvModel");
const CNCMachine = require("../models/cncModel");
const LeakTest = require("../models/leakTestModel");

// Get historical data for Welding Robot
exports.getWeldingRobotData = async (req, res) => {
  try {
    const data = await WeldingRobot.find().sort({ timestamp: -1 }).limit(50); // Get last 50 records
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Welding Robot data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get historical data for Stamping Press
exports.getStampingPressData = async (req, res) => {
  try {
    const data = await StampingPress.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Stamping Press data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get historical data for Painting Robot
exports.getPaintingRobotData = async (req, res) => {
  try {
    const data = await PaintingRobot.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Painting Robot data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get historical data for AGV
exports.getAGVData = async (req, res) => {
  try {
    const data = await AGV.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching AGV data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get historical data for CNC Machine
exports.getCNCMachineData = async (req, res) => {
  try {
    const data = await CNCMachine.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching CNC Machine data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get historical data for Leak Test
exports.getLeakTestData = async (req, res) => {
  try {
    const data = await LeakTest.find().sort({ timestamp: -1 }).limit(50);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Leak Test data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
