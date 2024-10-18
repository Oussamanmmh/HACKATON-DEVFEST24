const AGV = require("../models/agvModel");
const AGVThreshold = require("../models/AGVThreshold");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // check if there are documents in the database
    const existingData = await AGVThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      // generate data doucment which already has defuaalt values
      const dataDocument = new AGVThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    // Fetch the thresholds for the AGV from MongoDB
    const thresholds = await AGVThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for agv_003");
    }

    // Pass the data and thresholds to processMachineData for analysis
    await processMachineData(data, thresholds);

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
