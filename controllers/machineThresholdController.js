// controllers/machineThresholdController.js
const MachineThreshold = require("../models/WeldingRobotThreshold");

// Get machine thresholds by machine ID
exports.getMachineThreshold = async (req, res) => {
  const { machine_id } = req.params;

  try {
    const thresholds = await MachineThreshold.findOne({ machine_id });

    if (!thresholds) {
      console.error("Machine thresholds not found");
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
  const updatedThresholds = req.body.thresholds;

  try {
    const thresholds = await MachineThreshold.findOneAndUpdate(
      { machine_id },
      { thresholds: updatedThresholds },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: "Thresholds updated", thresholds });
  } catch (error) {
    console.error("Error updating machine thresholds:", error);
    res.status(500).json({ message: "Server error" });
  }
};
