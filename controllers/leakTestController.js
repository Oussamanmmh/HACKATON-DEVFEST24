const LeakTest = require("../models/leakTestModel");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;
    const newLeakTestData = new LeakTest(data);
    await newLeakTestData.save();
    res.status(200).send("Leak Test data stored");
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
    console.error("Error retrieving leak test machine data:", error);
    res.status(500).send("Server Error");
  }
};
