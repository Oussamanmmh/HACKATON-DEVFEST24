const AGV = require("../models/agvModel");
const AGVThreshold = require("../models/AGVThreshold");
const EnergyConsumption = require("../models/EnergyConsumption");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    const existingData = await AGVThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new AGVThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    const thresholds = await AGVThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for agv_003");
    }

    await processMachineData(data, thresholds);

    const historicalLogs = await AGV.find({ machine_id: data.machine_id })
      .sort({ timestamp: -1 })
      .limit(50);

    const totalEnergy = calculateEnergy(historicalLogs, data, "agv");

    const shift = determineShift();
    const energyLog = new EnergyConsumption({
      machine_id: data.machine_id,
      energy: totalEnergy,
      shift: shift,
      timestamp: new Date(),
    });
    await energyLog.save();
    console.log("energy saved .....", totalEnergy);

    res.status(200).send("AGV data stored, analyzed, and energy logged");
  } catch (error) {
    console.error("Error storing AGV data:", error);
    res.status(500).send("Server Error");
  }
};
const calculateEnergy = (historicalLogs, realTimeData, machineType) => {
  let totalEnergy = 0;

  if (machineType === "agv") {
    // Calculate energy based on battery usage and load weight
    historicalLogs.forEach((log) => {
      if (log.battery_level) {
        totalEnergy += 100 - log.battery_level; // Decrease in battery represents energy used
      }
    });

    if (realTimeData.battery_level) {
      totalEnergy += 100 - realTimeData.battery_level;
    }
  }

  return totalEnergy;
};

exports.getData = async (req, res) => {
  try {
    const data = await AGV.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving AGV data:", error);
    res.status(500).send("Server Error");
  }
};
// Determine shift based on current time
const determineShift = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 14) {
    return "Morning";
  } else if (currentHour >= 14 && currentHour < 22) {
    return "Afternoon";
  } else {
    return "Night";
  }
};
