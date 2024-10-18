const StampingPress = require("../models/stampingPressModel");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;
    const newStampingPressData = new StampingPress(data);
    await newStampingPressData.save();
    res.status(200).send("Stamping Press data stored");
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