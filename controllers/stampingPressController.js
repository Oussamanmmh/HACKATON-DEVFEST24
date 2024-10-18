const StampingPress = require("../models/stampingPressModel");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // Save the stamping press data to the database
    const newStampingData = new StampingPress(data);
    await newStampingData.save();
    // console.log("Stamping Press data saved:", data);

    // Pass the data to processMachineData for analysis
    await processMachineData(data);

    res.status(200).send("Stamping Press data stored and processed");
  } catch (error) {
    console.error("Error storing stamping press data:", error);
    res.status(500).send("Server Error");
  }
};
exports.getData = async (req, res) => {
  try {
    const data = await StampingPress.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving stamping press data:", error);
    res.status(500).send("Server Error");
  }
};
