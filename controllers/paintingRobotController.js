const PaintingRobot = require("../models/paintingRobotModel");
const PaintingRobotThreshold = require("../models/PaintingRobotThreshold");
const EnergyConsumption = require("../models/EnergyConsumption");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    const existingData = await PaintingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new PaintingRobotThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    const thresholds = await PaintingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res
        .status(400)
        .send("Thresholds not found for painting_robot_002");
    }

    await processMachineData(data, thresholds);

    const historicalLogs = await PaintingRobot.find({
      machine_id: data.machine_id,
    })
      .sort({ timestamp: -1 })
      .limit(50);

    const totalEnergy = calculateEnergy(historicalLogs, data, "paintingRobot");

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
      .send("Painting Robot data stored, analyzed, and energy logged");
  } catch (error) {
    console.error("Error storing painting robot data:", error);
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

  if (machineType === "paintingRobot") {
    // Calculate energy based on power consumption and paint flow rate
    historicalLogs.forEach((log) => {
      if (log.paint_flow_rate) {
        totalEnergy += log.paint_flow_rate;
      }
    });

    if (realTimeData.paint_flow_rate) {
      totalEnergy += realTimeData.paint_flow_rate;
    }
  }

  return totalEnergy;
};

exports.getData = async (req, res) => {
  try {
    const data = await PaintingRobot.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving painting robot data:", error);
    res.status(500).send("Server Error");
  }
};
