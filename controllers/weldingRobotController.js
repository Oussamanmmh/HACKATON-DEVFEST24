const WeldingRobot = require("../models/weldingRobotModel");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // Save the welding robot data to the database
    const newWeldingData = new WeldingRobot(data);
    await newWeldingData.save();
    // console.log("Welding Robot data saved:", data);

    // Pass the data to processMachineData for analysis
    await processMachineData(data); // This will send notifications if thresholds are exceeded

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
