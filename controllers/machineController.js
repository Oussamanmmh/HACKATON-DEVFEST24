const { sendPushNotification } = require("../services/firebaseService");
const User = require("../models/User");
const machineThresholds = require("../config/machineThresholds");

exports.processMachineData = async (req, res) => {
  const data = req.body;
  const { machine_id } = data;

  try {
    const thresholds = machineThresholds[machine_id];
    if (!thresholds) {
      return res.status(400).json({ message: "Unknown machine ID" });
    }

    const warnings = [];

    if (machine_id === "welding_robot_006") {
      const { weld_temperature, vibration_level, power_consumption } = data;

      if (weld_temperature >= thresholds.temperature.manager) {
        warnings.push(
          "Critical: Welding Robot Temperature is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Temperature");
      } else if (weld_temperature >= thresholds.temperature.worker) {
        warnings.push(
          "Warning: Welding Robot Temperature is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Temperature");
      }

      if (vibration_level >= thresholds.vibration.manager) {
        warnings.push(
          "Critical: Welding Robot Vibration is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Vibration");
      } else if (vibration_level >= thresholds.vibration.worker) {
        warnings.push(
          "Warning: Welding Robot Vibration is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Vibration");
      }

      if (power_consumption >= thresholds.powerConsumption.manager) {
        warnings.push(
          "Critical: Welding Robot Power Consumption is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Power Consumption");
      } else if (power_consumption >= thresholds.powerConsumption.worker) {
        warnings.push(
          "Warning: Welding Robot Power Consumption is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Power Consumption");
      }
    }

    if (machine_id === "stamping_press_001") {
      const { temperature, vibration_level, power_consumption } = data;

      if (temperature >= thresholds.temperature.manager) {
        warnings.push(
          "Critical: Stamping Press Temperature is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Temperature");
      } else if (temperature >= thresholds.temperature.worker) {
        warnings.push(
          "Warning: Stamping Press Temperature is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Temperature");
      }

      if (vibration_level >= thresholds.vibration.manager) {
        warnings.push(
          "Critical: Stamping Press Vibration is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Vibration");
      } else if (vibration_level >= thresholds.vibration.worker) {
        warnings.push(
          "Warning: Stamping Press Vibration is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Vibration");
      }

      if (power_consumption >= thresholds.powerConsumption.manager) {
        warnings.push(
          "Critical: Stamping Press Power Consumption is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Power Consumption");
      } else if (power_consumption >= thresholds.powerConsumption.worker) {
        warnings.push(
          "Warning: Stamping Press Power Consumption is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Power Consumption");
      }
    }

    if (machine_id === "painting_robot_002") {
      const { spray_pressure, paint_thickness, humidity } = data;

      if (spray_pressure >= thresholds.sprayPressure.manager) {
        warnings.push(
          "Critical: Painting Robot Spray Pressure is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Spray Pressure");
      } else if (spray_pressure >= thresholds.sprayPressure.worker) {
        warnings.push(
          "Warning: Painting Robot Spray Pressure is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Spray Pressure");
      }

      if (paint_thickness >= thresholds.paintThickness.manager) {
        warnings.push(
          "Critical: Painting Robot Paint Thickness is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Paint Thickness");
      } else if (paint_thickness >= thresholds.paintThickness.worker) {
        warnings.push(
          "Warning: Painting Robot Paint Thickness is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Paint Thickness");
      }

      if (humidity >= thresholds.humidity.manager) {
        warnings.push(
          "Critical: Painting Robot Humidity is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Humidity");
      } else if (humidity >= thresholds.humidity.worker) {
        warnings.push(
          "Warning: Painting Robot Humidity is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Humidity");
      }
    }

    if (machine_id === "agv_003") {
      const { battery_level, load_weight, speed } = data;

      if (battery_level <= thresholds.batteryLevel.manager) {
        warnings.push(
          "Critical: AGV Battery Level is too low! Notifying manager."
        );
        await notifyManager(machine_id, "Battery Level");
      } else if (battery_level <= thresholds.batteryLevel.worker) {
        warnings.push("Warning: AGV Battery Level is low! Notifying worker.");
        await notifyWorker(machine_id, "Battery Level");
      }

      if (load_weight >= thresholds.loadWeight.manager) {
        warnings.push(
          "Critical: AGV Load Weight is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Load Weight");
      } else if (load_weight >= thresholds.loadWeight.worker) {
        warnings.push("Warning: AGV Load Weight is high! Notifying worker.");
        await notifyWorker(machine_id, "Load Weight");
      }

      if (speed >= thresholds.speed.manager) {
        warnings.push("Critical: AGV Speed is too high! Notifying manager.");
        await notifyManager(machine_id, "Speed");
      } else if (speed >= thresholds.speed.worker) {
        warnings.push("Warning: AGV Speed is high! Notifying worker.");
        await notifyWorker(machine_id, "Speed");
      }
    }

    if (machine_id === "cnc_milling_004") {
      const { spindle_speed, vibration_level, power_consumption } = data;

      if (spindle_speed >= thresholds.spindleSpeed.manager) {
        warnings.push(
          "Critical: CNC Spindle Speed is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Spindle Speed");
      } else if (spindle_speed >= thresholds.spindleSpeed.worker) {
        warnings.push("Warning: CNC Spindle Speed is high! Notifying worker.");
        await notifyWorker(machine_id, "Spindle Speed");
      }

      if (vibration_level >= thresholds.vibration.manager) {
        warnings.push(
          "Critical: CNC Vibration is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Vibration");
      } else if (vibration_level >= thresholds.vibration.worker) {
        warnings.push("Warning: CNC Vibration is high! Notifying worker.");
        await notifyWorker(machine_id, "Vibration");
      }

      if (power_consumption >= thresholds.powerConsumption.manager) {
        warnings.push(
          "Critical: CNC Power Consumption is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Power Consumption");
      } else if (power_consumption >= thresholds.powerConsumption.worker) {
        warnings.push(
          "Warning: CNC Power Consumption is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Power Consumption");
      }
    }

    if (machine_id === "leak_test_005") {
      const { test_pressure, pressure_drop, leak_rate } = data;

      if (test_pressure >= thresholds.testPressure.manager) {
        warnings.push(
          "Critical: Leak Test Pressure is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Test Pressure");
      } else if (test_pressure >= thresholds.testPressure.worker) {
        warnings.push("Warning: Leak Test Pressure is high! Notifying worker.");
        await notifyWorker(machine_id, "Test Pressure");
      }

      if (pressure_drop >= thresholds.pressureDrop.manager) {
        warnings.push(
          "Critical: Leak Test Pressure Drop is too high! Notifying manager."
        );
        await notifyManager(machine_id, "Pressure Drop");
      } else if (pressure_drop >= thresholds.pressureDrop.worker) {
        warnings.push(
          "Warning: Leak Test Pressure Drop is high! Notifying worker."
        );
        await notifyWorker(machine_id, "Pressure Drop");
      }

      if (leak_rate >= thresholds.leakRate.manager) {
        warnings.push("Critical: Leak Rate is too high! Notifying manager.");
        await notifyManager(machine_id, "Leak Rate");
      } else if (leak_rate >= thresholds.leakRate.worker) {
        warnings.push("Warning: Leak Rate is high! Notifying worker.");
        await notifyWorker(machine_id, "Leak Rate");
      }
    }

    res.status(200).json({ message: "Data processed", warnings });
  } catch (error) {
    console.error("Error processing machine data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const notifyWorker = async (machineId, issue) => {
  const workers = await User.find({ role: "worker" });
  workers.forEach((worker) => {
    if (worker.notificationsToken) {
      sendPushNotification(
        worker.notificationsToken,
        `Warning: ${issue}`,
        `Machine ${machineId} requires attention due to ${issue}.`
      );
    }
  });
};

const notifyManager = async (machineId, issue) => {
  const managers = await User.find({ role: "manager" });
  managers.forEach((manager) => {
    if (manager.notificationsToken) {
      sendPushNotification(
        manager.notificationsToken,
        `Critical Alert: ${issue}`,
        `Machine ${machineId} is in critical condition due to ${issue}. Immediate action required.`
      );
    }
  });
};
