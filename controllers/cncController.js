const CNCMachine = require("../models/cncModel");
const CNCMachineThreshold = require("../models/CNCMillingThreshold");
const EnergyConsumption = require("../models/EnergyConsumption");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    const existingData = await CNCMachineThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new CNCMachineThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    const thresholds = await CNCMachineThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for cnc_milling_004");
    }

    await processMachineData(data, thresholds);

    const historicalLogs = await CNCMachine.find({
      machine_id: data.machine_id,
    })
      .sort({ timestamp: -1 })
      .limit(50);

    const totalEnergy = calculateEnergy(historicalLogs, data, "cncMachine");

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
      .send("CNC Machine data stored, analyzed, and energy logged");
  } catch (error) {
    console.error("Error storing CNC machine data:", error);
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

  if (machineType === "cncMachine") {
    // Calculate energy based on power consumption and spindle speed
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
    const data = await CNCMachine.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving CNC machine data:", error);
    res.status(500).send("Server Error");
  }
};
