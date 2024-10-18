const LeakTest = require("../models/leakTestModel");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // Save the leak test data to the database
    const newLeakTestData = new LeakTest(data);
    await newLeakTestData.save();
    // console.log("Leak Test data saved:", data);

    // Pass the data to processMachineData for analysis
    await processMachineData(data);

    res.status(200).send("Leak Test data stored and processed");
  } catch (error) {
    console.error("Error storing leak test data:", error);
    res.status(500).send("Server Error");
  }
};

exports.getData = async (req, res) => {
  try {
    const data = await LeakTest.find();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving leak test machine data:", error);
    res.status(500).send("Server Error");
  }
};
