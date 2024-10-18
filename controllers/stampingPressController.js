const StampingPress = require("../models/stampingPressModel");
const StampingPressThreshold = require("../models/StampingPressThreshold");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // check if there are documents in the database
    const existingData = await StampingPressThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      const dataDocument = new StampingPressThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }
    // Fetch the thresholds for the stamping press from MongoDB
    const thresholds = await StampingPressThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res
        .status(400)
        .send("Thresholds not found for stamping_press_001");
    }

    // Pass the data and thresholds to processMachineData for analysis
    await processMachineData(data, thresholds);

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
