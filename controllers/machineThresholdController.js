const WeldingRobotThreshold = require("../models/WeldingRobotThreshold");
const StampingPressThreshold = require("../models/StampingPressThreshold");
const PaintingRobotThreshold = require("../models/PaintingRobotThreshold");
const LeakTestThreshold = require("../models/LeakTestThreshold");
const CNCMachineThreshold = require("../models/CNCMillingThreshold");
const AGVThreshold = require("../models/AGVThreshold");

// Utility function to get the correct threshold model
const getModelByMachineId = (machine_id) => {
  switch (machine_id) {
    case "welding_robot_006":
      return WeldingRobotThreshold;
    case "stamping_press_001":
      return StampingPressThreshold;
    case "painting_robot_002":
      return PaintingRobotThreshold;
    case "leak_test_005":
      return LeakTestThreshold;
    case "cnc_milling_004":
      return CNCMachineThreshold;
    case "agv_003":
      return AGVThreshold;
    default:
      throw new Error("Unknown machine_id");
  }
};

// Get machine thresholds by machine ID
exports.getMachineThreshold = async (req, res) => {
  const { machine_id } = req.params;

  try {
    const ThresholdModel = getModelByMachineId(machine_id);
    const thresholds = await ThresholdModel.findOne({ machine_id });

    if (!thresholds) {
      return res.status(404).json({ message: "Machine thresholds not found." });
    }

    res.status(200).json(thresholds);
  } catch (error) {
    console.error("Error fetching machine thresholds:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// Update machine thresholds
exports.updateMachineThreshold = async (req, res) => {
  const { machine_id } = req.params;
  const updatedThresholds = req.body;

  try {
    // Dynamically get the model for the machine
    const ThresholdModel = getModelByMachineId(machine_id);

    // Find the existing threshold for this machine
    let thresholds = await ThresholdModel.findOne({ machine_id });

    if (!thresholds) {
      // If no threshold exists, create a new one
      thresholds = new ThresholdModel({ machine_id });
    }

    // Update each threshold parameter (worker, manager) based on the input
    Object.keys(updatedThresholds).forEach((key) => {
      thresholds[key] = updatedThresholds[key];
    });

    // Save the updated thresholds to the database
    await thresholds.save();

    res.status(200).json({ message: "Thresholds updated", thresholds });
  } catch (error) {
    console.error("Error updating machine thresholds:", error);
    res.status(500).json({ message: "Server error" });
  }
};
