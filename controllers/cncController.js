const CNC = require("../models/cncModel");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // Save the CNC machine data to the database
    const newCNCData = new CNC(data);
    await newCNCData.save();
    // console.log("CNC Machine data saved:", data);

    // Pass the data to processMachineData for analysis
    await processMachineData(data);

    res.status(200).send("CNC Machine data stored and processed");
  } catch (error) {
    console.error("Error storing CNC machine data:", error);
    res.status(500).send("Server Error");
  }
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
