const LeakTest = require("../models/leakTestModel");
const LeakTestThreshold = require("../models/LeakTestThreshold");
const EnergyConsumption = require("../models/EnergyConsumption");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    const existingData = await LeakTestThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new LeakTestThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    const thresholds = await LeakTestThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for leak_test_005");
    }

    await processMachineData(data, thresholds);

    const historicalLogs = await LeakTest.find({ machine_id: data.machine_id })
      .sort({ timestamp: -1 })
      .limit(50);

    const totalEnergy = calculateEnergy(historicalLogs, data, "leakTest");

    const shift = determineShift();
    const energyLog = new EnergyConsumption({
      machine_id: data.machine_id,
      energy: totalEnergy,
      shift: shift,
      timestamp: new Date(),
    });
    await energyLog.save();
    console.log("energy saved .....", totalEnergy);

    res.status(200).send("Leak Test data stored, analyzed, and energy logged");
  } catch (error) {
    console.error("Error storing leak test data:", error);
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
const calculateEnergy = (historicalLogs, realTimeData, machineType) => {
  let totalEnergy = 0;

  // Calculate energy based on test duration and power consumption
  historicalLogs.forEach((log) => {
    totalEnergy += log.test_pressure;
  });

  if (realTimeData.test_pressure) {
    totalEnergy += realTimeData.test_pressure;
  }

  return totalEnergy;
};

exports.getData = async (req, res) => {
  try {
    const data = await LeakTest.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving Leak Test data:", error);
    res.status(500).send("Server Error");
  }
};
