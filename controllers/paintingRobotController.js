const PaintingRobot = require("../models/paintingRobotModel");
const PaintingRobotThreshold = require("../models/PaintingRobotThreshold");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // check if there are documents in the database
    const existingData = await PaintingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      // generate data doucment which already has defuaalt values
      const dataDocument = new PaintingRobotThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }
    // Fetch the thresholds for the painting robot from MongoDB
    const thresholds = await PaintingRobotThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res
        .status(400)
        .send("Thresholds not found for painting_robot_002");
    }

    // Pass the data and thresholds to processMachineData for analysis
    await processMachineData(data, thresholds);

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
