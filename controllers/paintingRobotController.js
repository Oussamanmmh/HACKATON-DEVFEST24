const PaintingRobot = require("../models/paintingRobotModel");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // Save the painting robot data to the database
    const newPaintingData = new PaintingRobot(data);
    await newPaintingData.save();
    // console.log("Painting Robot data saved:", data);

    // Pass the data to processMachineData for analysis
    await processMachineData(data);

    res.status(200).send("Painting Robot data stored and processed");
  } catch (error) {
    console.error("Error storing painting robot data:", error);
    res.status(500).send("Server Error");
  }
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
