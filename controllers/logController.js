// controllers/logController.js

const MachineLog = require("../models/machineLogModel");

// Fetch all logs
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await MachineLog.find().sort({ timestamp: -1 }); // Fetch all logs sorted by timestamp
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching machine logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch logs by machine ID
exports.getLogsByMachineId = async (req, res) => {
  const { machine_id } = req.params;

  try {
    const logs = await MachineLog.find({ machine_id }).sort({ timestamp: -1 }); // Fetch logs by machine_id sorted by timestamp
    if (logs.length === 0) {
      return res
        .status(404)
        .json({ message: "No logs found for this machine." });
    }
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching machine logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
