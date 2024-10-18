const AGV = require("../models/agvModel");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;
    const newAGVData = new AGV(data);
    await newAGVData.save();
    res.status(200).send("AGV data stored");
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