const WeldingRobot = require("../models/weldingRobotModel");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;
    const newWeldingData = new WeldingRobot(data);
    await newWeldingData.save();
    res.status(200).send("Welding Robot data stored");
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
