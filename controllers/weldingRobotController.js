const WeldingRobot = require("../models/weldingRobotModel");
const WeldingRobotThreshold = require("../models/WeldingRobotThreshold");
const EnergyConsumption = require("../models/EnergyConsumption");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    const existingData = await WeldingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new WeldingRobotThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    const thresholds = await WeldingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for welding_robot_006");
    }

    await processMachineData(data, thresholds);

    // Fetch the last 50 logs from the database
    const historicalLogs = await WeldingRobot.find({
      machine_id: data.machine_id,
    })
      .sort({ timestamp: -1 })
      .limit(50);

    // Calculate energy based on historical logs
    const totalEnergy = calculateEnergy(historicalLogs, data, "weldingRobot");

    // Log energy consumption into EnergyConsumption collection
    const shift = determineShift();
    const energyLog = new EnergyConsumption({
      machine_id: data.machine_id,
      energy: totalEnergy,
      shift: shift,
      timestamp: new Date(),
    });
    await energyLog.save();
    console.log("energy saved .....", totalEnergy);

    console.log("energy saved .....", totalEnergy);

    res
      .status(200)
      .send("Welding Robot data stored, analyzed, and energy logged");
  } catch (error) {
    console.error("Error storing welding robot data:", error);
    res.status(500).send("Server Error");
  }
};

const calculateEnergy = (historicalLogs, realTimeData, machineType) => {
  let totalEnergy = 0;

  if (machineType === "weldingRobot") {
    // Calculate energy based on power consumption and weld time
    historicalLogs.forEach((log) => {
      if (log.power_consumption && log.weld_time) {
        totalEnergy += log.power_consumption * (log.weld_time / 1000); // Convert ms to seconds
      }
    });

    if (realTimeData.power_consumption && realTimeData.weld_time) {
      totalEnergy +=
        realTimeData.power_consumption * (realTimeData.weld_time / 1000);
    }
  }

  return totalEnergy;
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

exports.getData = async (req, res) => {
  try {
    const data = await WeldingRobot.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving welding robot data:", error);
    res.status(500).send("Server Error");
  }
};
