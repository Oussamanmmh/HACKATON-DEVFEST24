const LeakTest = require("../models/leakTestModel");
const LeakTestThreshold = require("../models/LeakTestThreshold");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // check if there are documents in the database
    const existingData = await LeakTestThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!existingData) {
      // generate data doucment which already has defuaalt values
      const dataDocument = new LeakTestThreshold({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }
    // Fetch the thresholds for the leak test from MongoDB
    const thresholds = await LeakTestThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for leak_test_005");
    }

    // Pass the data and thresholds to processMachineData for analysis
    await processMachineData(data, thresholds);

    res.status(200).send("Leak Test data stored and processed");
  } catch (error) {
    console.error("Error storing Leak Test data:", error);
    res.status(500).send("Server Error");
  }
};

exports.getData = async (req, res) => {
  try {
    const data = await LeakTest.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving Leak Test data:", error);
    res.status(500).send("Server Error");
  }
};
