const EnergyConsumption = require("../models/EnergyConsumption");

// Get all energy logs
exports.getAllEnergyLogs = async (req, res) => {
  try {
    const energyLogs = await EnergyConsumption.find().sort({ timestamp: -1 });
    res.status(200).json(energyLogs);
  } catch (error) {
    console.error("Error retrieving energy logs:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get energy logs by machine ID
exports.getEnergyByMachineId = async (req, res) => {
  try {
    const { machine_id } = req.params; // Machine ID from URL
    const energyLogs = await EnergyConsumption.find({ machine_id }).sort({ timestamp: -1 });

    if (energyLogs.length === 0) {
      return res.status(404).json({ message: `No energy logs found for machine ID: ${machine_id}` });
    }

    res.status(200).json(energyLogs);
  } catch (error) {
    console.error(`Error retrieving energy logs for machine ID ${req.params.machine_id}:`, error);
    res.status(500).json({ message: "Server Error" });
  }
};
