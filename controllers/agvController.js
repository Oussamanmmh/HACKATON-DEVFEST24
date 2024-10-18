const AGV = require("../models/agvModel");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // Save the AGV data to the database
    const newAGVData = new AGV(data);
    await newAGVData.save();
    // console.log("AGV data saved:", data);

    // Pass the data to processMachineData for analysis
    await processMachineData(data);

    res.status(200).send("AGV data stored and processed");
  } catch (error) {
    console.error("Error storing AGV data:", error);
    res.status(500).send("Server Error");
  }
};

exports.getData = async (req, res) => {
  try {
    const data = await AGV.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving AGV data:", error);
    res.status(500).send("Server Error");
  }
};
