const CNCMachine = require("../models/cncModel");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;
    const newCNCData = new CNCMachine(data);
    await newCNCData.save();
    res.status(200).send("CNC Machine data stored");
  } catch (error) {
    console.error("Error storing CNC Machine data:", error);
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