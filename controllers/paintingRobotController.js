const PaintingRobot = require("../models/paintingRobotModel");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;
    const newPaintingData = new PaintingRobot(data);
    await newPaintingData.save();
    res.status(200).send("Painting Robot data stored");
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