const WeldingRobot = require("../models/weldingRobotModel");
const WeldingRobotThreshold = require("../models/WeldingRobotThreshold");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // check if there are documents in the database
    const existingData = await WeldingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      // generate data doucment which already has defuaalt values
      const dataDocument = new WeldingRobotThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }
    // Fetch the thresholds for the welding robot from MongoDB
    const thresholds = await WeldingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for welding_robot_006");
    }

    // Pass the data and thresholds to processMachineData for analysis
    await processMachineData(data, thresholds);

    res.status(200).send("Welding Robot data stored and processed");
  } catch (error) {
    console.error("Error storing welding robot data:", error);
    res.status(500).send("Server Error");
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
