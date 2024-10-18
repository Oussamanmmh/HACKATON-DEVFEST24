const CNCMachine = require("../models/CNCMillingThreshold");
const CNCMachineThreshold = require("../models/CNCMillingThreshold");
const { processMachineData } = require("../controllers/machineController");

exports.receiveData = async (req, res) => {
  try {
    const data = req.body;

    // check if there are documents in the database 
    const existingData = await CNCMachine.findOne({ machine_id: data.machine_id });

    if (!existingData) {
      // generate data doucment which already has defuaalt values
      const dataDocument = new CNCMachine({
        machine_id: data.machine_id,
      });
      await dataDocument.save();
    }

    // Fetch the thresholds for the CNC machine from MongoDB
    const thresholds = await CNCMachineThreshold.findOne({
      machine_id: data.machine_id,
    });

    if (!thresholds) {
      return res.status(400).send("Thresholds not found for cnc_milling_004");
    }

    // Pass the data and thresholds to processMachineData for analysis
    await processMachineData(data, thresholds);

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
