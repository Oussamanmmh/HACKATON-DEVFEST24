const { sendPushNotification } = require("../services/firebaseService");
const User = require("../models/User");
const machineThresholds = require("../config/machineThresholds");
const MachineLog = require("../models/machineLogModel"); // Import the MachineLog model

exports.processMachineData = async (data) => {
  const { machine_id } = data;

  if (!machine_id) {
    console.error("Missing machine_id in the data.");
    return;
  }

  try {
    // Check if machine_id has thresholds configured
    const thresholds = machineThresholds[machine_id];
    if (!thresholds) {
      console.error(`Unknown machine ID: ${machine_id}`);
      return;
    }

    const warnings = [];

    // Process data based on machine_id
    switch (machine_id) {
      case "welding_robot_006":
        await handleWeldingRobot(data, thresholds, warnings);
        break;
      case "stamping_press_001":
        await handleStampingPress(data, thresholds, warnings);
        break;
      case "painting_robot_002":
        await handlePaintingRobot(data, thresholds, warnings);
        break;
      case "agv_003":
        await handleAGV(data, thresholds, warnings);
        break;
      case "cnc_milling_004":
        await handleCNCMachine(data, thresholds, warnings);
        break;
      case "leak_test_005":
        await handleLeakTest(data, thresholds, warnings);
        break;
      default:
        console.error(`Invalid machine ID: ${machine_id}`);
        return;
    }

    // Save the log to the database
    const log = new MachineLog({
      machine_id, // ID of the machine
      data, // The raw data received
      warnings, // Any warnings generated during processing
    });

    await log.save(); // Save the log to MongoDB
    console.log("Machine log saved successfully.");
  } catch (error) {
    console.error("Error processing machine data:", error);
  }
};
// Helper function to process Welding Robot data
const handleWeldingRobot = async (data, thresholds, warnings) => {
  const {
    weld_temperature,
    vibration_level,
    power_consumption,
    weld_current,
    weld_voltage,
    weld_time,
    pressure_applied,
    arm_position,
    wire_feed_rate,
    gas_flow_rate,
    weld_strength_estimate,
  } = data;

  if (weld_temperature >= thresholds.weld_temperature.manager) {
    warnings.push(
      "Critical: Welding Robot Temperature is too high! Notifying manager."
    );
    await notifyManager("welding_robot_006", "Temperature");
  } else if (weld_temperature >= thresholds.weld_temperature.worker) {
    warnings.push(
      "Warning: Welding Robot Temperature is high! Notifying worker."
    );
    await notifyWorker("welding_robot_006", "Temperature");
  }

  if (vibration_level >= thresholds.vibration_level.manager) {
    warnings.push(
      "Critical: Welding Robot Vibration is too high! Notifying manager."
    );
    await notifyManager("welding_robot_006", "Vibration");
  } else if (vibration_level >= thresholds.vibration_level.worker) {
    warnings.push(
      "Warning: Welding Robot Vibration is high! Notifying worker."
    );
    await notifyWorker("welding_robot_006", "Vibration");
  }

  if (power_consumption >= thresholds.power_consumption.manager) {
    warnings.push(
      "Critical: Welding Robot Power Consumption is too high! Notifying manager."
    );
    await notifyManager("welding_robot_006", "Power Consumption");
  } else if (power_consumption >= thresholds.power_consumption.worker) {
    warnings.push(
      "Warning: Welding Robot Power Consumption is high! Notifying worker."
    );
    await notifyWorker("welding_robot_006", "Power Consumption");
  }

  // Additional properties to log but not triggering notifications
  console.log("Weld Current:", weld_current);
  console.log("Weld Voltage:", weld_voltage);
  console.log("Weld Time:", weld_time);
  console.log("Pressure Applied:", pressure_applied);
  console.log("Arm Position:", arm_position);
  console.log("Wire Feed Rate:", wire_feed_rate);
  console.log("Gas Flow Rate:", gas_flow_rate);
  console.log("Weld Strength Estimate:", weld_strength_estimate);
};
// Helper function to process Stamping Press data
const handleStampingPress = async (data, thresholds, warnings) => {
  const {
    temperature,
    vibration_level,
    power_consumption,
    force_applied,
    cycle_time,
    oil_pressure,
    die_alignment,
    sheet_thickness,
    noise_level,
    lubrication_flow_rate,
  } = data;

  if (temperature >= thresholds.temperature.manager) {
    warnings.push(
      "Critical: Stamping Press Temperature is too high! Notifying manager."
    );
    await notifyManager("stamping_press_001", "Temperature");
  } else if (temperature >= thresholds.temperature.worker) {
    warnings.push(
      "Warning: Stamping Press Temperature is high! Notifying worker."
    );
    await notifyWorker("stamping_press_001", "Temperature");
  }

  if (vibration_level >= thresholds.vibration_level.manager) {
    warnings.push(
      "Critical: Stamping Press Vibration is too high! Notifying manager."
    );
    await notifyManager("stamping_press_001", "Vibration");
  } else if (vibration_level >= thresholds.vibration_level.worker) {
    warnings.push(
      "Warning: Stamping Press Vibration is high! Notifying worker."
    );
    await notifyWorker("stamping_press_001", "Vibration");
  }

  if (power_consumption >= thresholds.power_consumption.manager) {
    warnings.push(
      "Critical: Stamping Press Power Consumption is too high! Notifying manager."
    );
    await notifyManager("stamping_press_001", "Power Consumption");
  } else if (power_consumption >= thresholds.power_consumption.worker) {
    warnings.push(
      "Warning: Stamping Press Power Consumption is high! Notifying worker."
    );
    await notifyWorker("stamping_press_001", "Power Consumption");
  }

  // Additional properties to log but not triggering notifications
  console.log("Force Applied:", force_applied);
  console.log("Cycle Time:", cycle_time);
  console.log("Oil Pressure:", oil_pressure);
  console.log("Die Alignment:", die_alignment);
  console.log("Sheet Thickness:", sheet_thickness);
  console.log("Noise Level:", noise_level);
  console.log("Lubrication Flow Rate:", lubrication_flow_rate);
};

// Helper function to process Painting Robot data
const handlePaintingRobot = async (data, thresholds, warnings) => {
  const {
    spray_pressure,
    paint_thickness,
    humidity,
    arm_position,
    paint_flow_rate,
    atomizer_speed,
    overspray_capture_efficiency,
    booth_airflow_velocity,
    solvent_concentration,
  } = data;

  if (spray_pressure >= thresholds.spray_pressure.manager) {
    warnings.push(
      "Critical: Painting Robot Spray Pressure is too high! Notifying manager."
    );
    await notifyManager("painting_robot_002", "Spray Pressure");
  } else if (spray_pressure >= thresholds.spray_pressure.worker) {
    warnings.push(
      "Warning: Painting Robot Spray Pressure is high! Notifying worker."
    );
    await notifyWorker("painting_robot_002", "Spray Pressure");
  }

  if (paint_thickness >= thresholds.paint_thickness.manager) {
    warnings.push(
      "Critical: Painting Robot Paint Thickness is too high! Notifying manager."
    );
    await notifyManager("painting_robot_002", "Paint Thickness");
  } else if (paint_thickness >= thresholds.paint_thickness.worker) {
    warnings.push(
      "Warning: Painting Robot Paint Thickness is high! Notifying worker."
    );
    await notifyWorker("painting_robot_002", "Paint Thickness");
  }

  if (humidity >= thresholds.humidity.manager) {
    warnings.push(
      "Critical: Painting Robot Humidity is too high! Notifying manager."
    );
    await notifyManager("painting_robot_002", "Humidity");
  } else if (humidity >= thresholds.humidity.worker) {
    warnings.push(
      "Warning: Painting Robot Humidity is high! Notifying worker."
    );
    await notifyWorker("painting_robot_002", "Humidity");
  }

  // Additional properties to log but not triggering notifications
  console.log("Arm Position:", arm_position);
  console.log("Paint Flow Rate:", paint_flow_rate);
  console.log("Atomizer Speed:", atomizer_speed);
  console.log("Overspray Capture Efficiency:", overspray_capture_efficiency);
  console.log("Booth Airflow Velocity:", booth_airflow_velocity);
  console.log("Solvent Concentration:", solvent_concentration);
};

// Helper function to process AGV data
const handleAGV = async (data, thresholds, warnings) => {
  const {
    battery_level,
    load_weight,
    speed,
    location,
    distance_traveled,
    obstacle_detection,
    navigation_status,
    vibration_level,
    temperature,
    wheel_rotation_speed,
  } = data;

  if (battery_level <= thresholds.battery_level.manager) {
    warnings.push("Critical: AGV Battery Level is too low! Notifying manager.");
    await notifyManager("agv_003", "Battery Level");
  } else if (battery_level <= thresholds.battery_level.worker) {
    warnings.push("Warning: AGV Battery Level is low! Notifying worker.");
    await notifyWorker("agv_003", "Battery Level");
  }

  if (load_weight >= thresholds.load_weight.manager) {
    warnings.push("Critical: AGV Load Weight is too high! Notifying manager.");
    await notifyManager("agv_003", "Load Weight");
  } else if (load_weight >= thresholds.load_weight.worker) {
    warnings.push("Warning: AGV Load Weight is high! Notifying worker.");
    await notifyWorker("agv_003", "Load Weight");
  }

  if (speed >= thresholds.speed.manager) {
    warnings.push("Critical: AGV Speed is too high! Notifying manager.");
    await notifyManager("agv_003", "Speed");
  } else if (speed >= thresholds.speed.worker) {
    warnings.push("Warning: AGV Speed is high! Notifying worker.");
    await notifyWorker("agv_003", "Speed");
  }

  // Additional properties to log but not triggering notifications
  console.log("Location:", location);
  console.log("Distance Traveled:", distance_traveled);
  console.log("Obstacle Detection:", obstacle_detection);
  console.log("Navigation Status:", navigation_status);
  console.log("Vibration Level:", vibration_level);
  console.log("Temperature:", temperature);
  console.log("Wheel Rotation Speed:", wheel_rotation_speed);
};

// Helper function to process CNC Machine data
const handleCNCMachine = async (data, thresholds, warnings) => {
  const {
    spindle_speed,
    vibration_level,
    power_consumption,
    tool_wear_level,
    cut_depth,
    feed_rate,
    coolant_flow_rate,
    material_hardness,
    temperature,
    chip_load,
  } = data;

  if (spindle_speed >= thresholds.spindle_speed.manager) {
    warnings.push(
      "Critical: CNC Spindle Speed is too high! Notifying manager."
    );
    await notifyManager("cnc_milling_004", "Spindle Speed");
  } else if (spindle_speed >= thresholds.spindle_speed.worker) {
    warnings.push("Warning: CNC Spindle Speed is high! Notifying worker.");
    await notifyWorker("cnc_milling_004", "Spindle Speed");
  }

  if (vibration_level >= thresholds.vibration_level.manager) {
    warnings.push("Critical: CNC Vibration is too high! Notifying manager.");
    await notifyManager("cnc_milling_004", "Vibration");
  } else if (vibration_level >= thresholds.vibration_level.worker) {
    warnings.push("Warning: CNC Vibration is high! Notifying worker.");
    await notifyWorker("cnc_milling_004", "Vibration");
  }

  if (power_consumption >= thresholds.power_consumption.manager) {
    warnings.push(
      "Critical: CNC Power Consumption is too high! Notifying manager."
    );
    await notifyManager("cnc_milling_004", "Power Consumption");
  } else if (power_consumption >= thresholds.power_consumption.worker) {
    warnings.push("Warning: CNC Power Consumption is high! Notifying worker.");
    await notifyWorker("cnc_milling_004", "Power Consumption");
  }

  // Additional properties to log but not triggering notifications
  console.log("Tool Wear Level:", tool_wear_level);
  console.log("Cut Depth:", cut_depth);
  console.log("Feed Rate:", feed_rate);
  console.log("Coolant Flow Rate:", coolant_flow_rate);
  console.log("Material Hardness:", material_hardness);
  console.log("Temperature:", temperature);
  console.log("Chip Load:", chip_load);
};
// Helper function to process Leak Test data
const handleLeakTest = async (data, thresholds, warnings) => {
  const {
    test_pressure,
    pressure_drop,
    leak_rate,
    test_duration,
    temperature,
    fluid_type,
    seal_condition,
    test_cycle_count,
  } = data;

  if (test_pressure >= thresholds.test_pressure.manager) {
    warnings.push(
      "Critical: Leak Test Pressure is too high! Notifying manager."
    );
    await notifyManager("leak_test_005", "Test Pressure");
  } else if (test_pressure >= thresholds.test_pressure.worker) {
    warnings.push("Warning: Leak Test Pressure is high! Notifying worker.");
    await notifyWorker("leak_test_005", "Test Pressure");
  }

  if (pressure_drop >= thresholds.pressure_drop.manager) {
    warnings.push(
      "Critical: Leak Test Pressure Drop is too high! Notifying manager."
    );
    await notifyManager("leak_test_005", "Pressure Drop");
  } else if (pressure_drop >= thresholds.pressure_drop.worker) {
    warnings.push(
      "Warning: Leak Test Pressure Drop is high! Notifying worker."
    );
    await notifyWorker("leak_test_005", "Pressure Drop");
  }

  if (leak_rate >= thresholds.leak_rate.manager) {
    warnings.push("Critical: Leak Rate is too high! Notifying manager.");
    await notifyManager("leak_test_005", "Leak Rate");
  } else if (leak_rate >= thresholds.leak_rate.worker) {
    warnings.push("Warning: Leak Rate is high! Notifying worker.");
    await notifyWorker("leak_test_005", "Leak Rate");
  }

  // Additional properties to log but not triggering notifications
  console.log("Test Duration:", test_duration);
  console.log("Temperature:", temperature);
  console.log("Fluid Type:", fluid_type);
  console.log("Seal Condition:", seal_condition);
  console.log("Test Cycle Count:", test_cycle_count);
};

// Generic function to notify workers
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

// Generic function to notify managers
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
