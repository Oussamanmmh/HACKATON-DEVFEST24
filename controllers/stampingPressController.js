const StampingPress = require("../models/stampingPressModel");
const StampingPressThreshold = require("../models/StampingPressThreshold");
const EnergyConsumption = require("../models/EnergyConsumption");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    const existingData = await StampingPressThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new StampingPressThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    const thresholds = await StampingPressThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res
        .status(400)
        .send("Thresholds not found for stamping_press_001");
    }

    await processMachineData(data, thresholds);

    const historicalLogs = await StampingPress.find({
      machine_id: data.machine_id,
    })
      .sort({ timestamp: -1 })
      .limit(50);

    const totalEnergy = calculateEnergy(historicalLogs, data, "stampingPress");

    const shift = determineShift();
    const energyLog = new EnergyConsumption({
      machine_id: data.machine_id,
      energy: totalEnergy,
      shift: shift,
      timestamp: new Date(),
    });
    await energyLog.save();
    console.log("energy saved .....", totalEnergy);

    res
      .status(200)
      .send("Stamping Press data stored, analyzed, and energy logged");
  } catch (error) {
    console.error("Error storing stamping press data:", error);
    res.status(500).send("Server Error");
  }
};
const calculateEnergy = (historicalLogs, realTimeData, machineType) => {
  let totalEnergy = 0;

  if (machineType === "stampingPress") {
    // Calculate energy based on power consumption and cycle time
    historicalLogs.forEach((log) => {
      if (log.power_consumption) {
        totalEnergy += log.power_consumption;
      }
    });

    if (realTimeData.power_consumption) {
      totalEnergy += realTimeData.power_consumption;
    }
  }

  return totalEnergy;
};

exports.getData = async (req, res) => {
  try {
    const data = await StampingPress.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving stamping press data:", error);
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
