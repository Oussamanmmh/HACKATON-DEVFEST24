const Task = require("../models/taskModel");
const ProductController = require("../controllers/productController");
const { sendPushNotification } = require("../services/firebaseService");
const User = require("../models/User");
const MachineLog = require("../models/machineLogModel");
const Notification = require("../models/Notification");

exports.processMachineData = async (data, thresholds) => {
  const { machine_id } = data;

  if (!machine_id) {
    console.error("Missing machine_id in the data.");
    return;
  }

  const warnings = [];
  let status = "normal";

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

  if (warnings.some((warning) => warning.includes("Critical"))) {
    status = "danger";
  } else if (warnings.length > 0) {
    status = "warning";
  }

  const log = new MachineLog({
    machine_id,
    machineType: machine_id,
    sensorData: data,
    warnings,
    status,
    timestamp: data.timestamp || new Date(),
  });

  await log.save();

  await ProductController.incrementProductCount(warnings);

  console.info("Machine log saved successfully.");
};
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
    console.log("Problem happened");
    warnings.push(
      "Critical: Welding Robot Temperature is too high! Notifying manager."
    );
    await notifyManager("welding_robot_006", data, "Temperature");
  } else if (weld_temperature >= thresholds.weld_temperature.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Welding Robot Temperature is high! Notifying worker."
    );
    await notifyWorker("welding_robot_006", data, "Temperature");
  }

  if (vibration_level >= thresholds.vibration_level.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Welding Robot Vibration is too high! Notifying manager."
    );
    await notifyManager("welding_robot_006", data, "Vibration");
  } else if (vibration_level >= thresholds.vibration_level.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Welding Robot Vibration is high! Notifying worker."
    );
    await notifyWorker("welding_robot_006", data, "Vibration");
  }

  if (power_consumption >= thresholds.power_consumption.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Welding Robot Power Consumption is too high! Notifying manager."
    );
    await notifyManager("welding_robot_006", data, "Power Consumption");
  } else if (power_consumption >= thresholds.power_consumption.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Welding Robot Power Consumption is high! Notifying worker."
    );
    await notifyWorker("welding_robot_006", data, "Power Consumption");
  }
};

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
    console.log("Problem happened");
    warnings.push(
      "Critical: Stamping Press Temperature is too high! Notifying manager."
    );
    await notifyManager("stamping_press_001", data, "Temperature");
  } else if (temperature >= thresholds.temperature.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Stamping Press Temperature is high! Notifying worker."
    );
    await notifyWorker("stamping_press_001", data, "Temperature");
  }

  if (vibration_level >= thresholds.vibration_level.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Stamping Press Vibration is too high! Notifying manager."
    );
    await notifyManager("stamping_press_001", data, "Vibration");
  } else if (vibration_level >= thresholds.vibration_level.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Stamping Press Vibration is high! Notifying worker."
    );
    await notifyWorker("stamping_press_001", data, "Vibration");
  }

  if (power_consumption >= thresholds.power_consumption.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Stamping Press Power Consumption is too high! Notifying manager."
    );
    await notifyManager("stamping_press_001", data, "Power Consumption");
  } else if (power_consumption >= thresholds.power_consumption.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Stamping Press Power Consumption is high! Notifying worker."
    );
    await notifyWorker("stamping_press_001", data, "Power Consumption");
  }
};

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
    console.log("Problem happened");
    warnings.push(
      "Critical: Painting Robot Spray Pressure is too high! Notifying manager."
    );
    await notifyManager("painting_robot_002", data, "Spray Pressure");
  } else if (spray_pressure >= thresholds.spray_pressure.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Painting Robot Spray Pressure is high! Notifying worker."
    );
    await notifyWorker("painting_robot_002", data, "Spray Pressure");
  }

  if (paint_thickness >= thresholds.paint_thickness.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Painting Robot Paint Thickness is too high! Notifying manager."
    );
    await notifyManager("painting_robot_002", data, "Paint Thickness");
  } else if (paint_thickness >= thresholds.paint_thickness.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Painting Robot Paint Thickness is high! Notifying worker."
    );
    await notifyWorker("painting_robot_002", data, "Paint Thickness");
  }

  if (humidity >= thresholds.humidity.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Painting Robot Humidity is too high! Notifying manager."
    );
    await notifyManager("painting_robot_002", data, "Humidity");
  } else if (humidity >= thresholds.humidity.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Painting Robot Humidity is high! Notifying worker."
    );
    await notifyWorker("painting_robot_002", data, "Humidity");
  }
};

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
    console.log("Problem happened");
    warnings.push("Critical: AGV Battery Level is too low! Notifying manager.");
    await notifyManager("agv_003", data, "Battery Level");
  } else if (battery_level <= thresholds.battery_level.worker) {
    console.log("Problem happened");
    warnings.push("Warning: AGV Battery Level is low! Notifying worker.");
    await notifyWorker("agv_003", data, "Battery Level");
  }

  if (load_weight >= thresholds.load_weight.manager) {
    console.log("Problem happened");
    warnings.push("Critical: AGV Load Weight is too high! Notifying manager.");
    await notifyManager("agv_003", data, "Load Weight");
  } else if (load_weight >= thresholds.load_weight.worker) {
    console.log("Problem happened");
    warnings.push("Warning: AGV Load Weight is high! Notifying worker.");
    await notifyWorker("agv_003", data, "Load Weight");
  }

  if (speed >= thresholds.speed.manager) {
    console.log("Problem happened");
    warnings.push("Critical: AGV Speed is too high! Notifying manager.");
    await notifyManager("agv_003", data, "Speed");
  } else if (speed >= thresholds.speed.worker) {
    console.log("Problem happened");
    warnings.push("Warning: AGV Speed is high! Notifying worker.");
    await notifyWorker("agv_003", data, "Speed");
  }
};

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
    console.log("Problem happened");
    warnings.push(
      "Critical: CNC Spindle Speed is too high! Notifying manager."
    );
    await notifyManager("cnc_milling_004", data, "Spindle Speed");
  } else if (spindle_speed >= thresholds.spindle_speed.worker) {
    console.log("Problem happened");
    warnings.push("Warning: CNC Spindle Speed is high! Notifying worker.");
    await notifyWorker("cnc_milling_004", data, "Spindle Speed");
  }

  if (vibration_level >= thresholds.vibration_level.manager) {
    console.log("Problem happened");
    warnings.push("Critical: CNC Vibration is too high! Notifying manager.");
    await notifyManager("cnc_milling_004", data, "Vibration");
  } else if (vibration_level >= thresholds.vibration_level.worker) {
    console.log("Problem happened");
    warnings.push("Warning: CNC Vibration is high! Notifying worker.");
    await notifyWorker("cnc_milling_004", data, "Vibration");
  }

  if (power_consumption >= thresholds.power_consumption.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: CNC Power Consumption is too high! Notifying manager."
    );
    await notifyManager("cnc_milling_004", data, "Power Consumption");
  } else if (power_consumption >= thresholds.power_consumption.worker) {
    console.log("Problem happened");
    warnings.push("Warning: CNC Power Consumption is high! Notifying worker.");
    await notifyWorker("cnc_milling_004", data, "Power Consumption");
  }
};
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
    console.log("Problem happened");
    warnings.push(
      "Critical: Leak Test Pressure is too high! Notifying manager."
    );
    await notifyManager("leak_test_005", data, "Test Pressure");
  } else if (test_pressure >= thresholds.test_pressure.worker) {
    console.log("Problem happened");
    warnings.push("Warning: Leak Test Pressure is high! Notifying worker.");
    await notifyWorker("leak_test_005", data, "Test Pressure");
  }

  if (pressure_drop >= thresholds.pressure_drop.manager) {
    console.log("Problem happened");
    warnings.push(
      "Critical: Leak Test Pressure Drop is too high! Notifying manager."
    );
    await notifyManager("leak_test_005", data, "Pressure Drop");
  } else if (pressure_drop >= thresholds.pressure_drop.worker) {
    console.log("Problem happened");
    warnings.push(
      "Warning: Leak Test Pressure Drop is high! Notifying worker."
    );
    await notifyWorker("leak_test_005", data, "Pressure Drop");
  }

  if (leak_rate >= thresholds.leak_rate.manager) {
    console.log("Problem happened");
    warnings.push("Critical: Leak Rate is too high! Notifying manager.");
    await notifyManager("leak_test_005", data, "Leak Rate");
  } else if (leak_rate >= thresholds.leak_rate.worker) {
    console.log("Problem happened");
    warnings.push("Warning: Leak Rate is high! Notifying worker.");
    await notifyWorker("leak_test_005", data, "Leak Rate");
  }
};
const notifyWorker = async (machineId, issue, sensorData, machineType) => {
  const workers = await User.find({ role: "worker" });

  workers.forEach(async (worker) => {
    if (worker.notificationsToken) {
      sendPushNotification(
        worker.notificationsToken,
        `Warning: ${issue}`,
        `Machine ${machineId} requires attention due to ${issue}.`
      );
    }

    const now = new Date();
    let scheduledDate = new Date();

    const startOfWorkDay = new Date(now.setHours(9, 0, 0, 0));
    const endOfWorkDay = new Date(now.setHours(18, 0, 0, 0));

    if (now >= startOfWorkDay && now <= endOfWorkDay) {
      scheduledDate = new Date();
    } else if (now < startOfWorkDay) {
      scheduledDate = startOfWorkDay;
    } else {
      scheduledDate = new Date(now.setDate(now.getDate() + 1));
      scheduledDate.setHours(9, 0, 0, 0);
    }

    const newNotification = new Notification({
      userId: worker._id,
      title: `Warning: ${issue}`,
      message: `Machine ${machineId} requires attention due to ${issue}.`,
      machineId: machineId,
    });
    await newNotification.save();

    worker.notifications.push(newNotification._id);
    await worker.save();

    const task = new Task({
      userId: worker._id,
      taskTitle: `Handle Warning on Machine ${machineId}`,
      description: `The machine ${machineId} has a warning due to ${issue}. Please check it immediately.`,
      scheduledDate: scheduledDate,
      isDone: false,
      taskType: "alert",
      machineData: {
        machine_id: machineId,
        machineType: machineType,
        sensorData: sensorData,
      },
    });

    await task.save();

    worker.tasks.push(task._id);
    await worker.save();
  });
};
const notifyManager = async (machineId, issue, sensorData, machineType) => {
  const managers = await User.find({ role: "manager" });

  managers.forEach(async (manager) => {
    if (manager.notificationsToken) {
      sendPushNotification(
        manager.notificationsToken,
        `Critical Alert: ${issue}`,
        `Machine ${machineId} is in critical condition due to ${issue}. Immediate action required.`
      );
    }

    const now = new Date();
    let scheduledDate = new Date();

    const startOfWorkDay = new Date(now.setHours(9, 0, 0, 0));
    const endOfWorkDay = new Date(now.setHours(18, 0, 0, 0));

    if (now >= startOfWorkDay && now <= endOfWorkDay) {
      scheduledDate = new Date();
    } else if (now < startOfWorkDay) {
      scheduledDate = startOfWorkDay;
    } else {
      scheduledDate = new Date(now.setDate(now.getDate() + 1));
      scheduledDate.setHours(9, 0, 0, 0);
    }

    const newNotification = new Notification({
      userId: manager._id,
      title: `Critical Alert: ${issue}`,
      message: `Machine ${machineId} is in critical condition due to ${issue}. Immediate action required.`,
      machineId: machineId,
    });
    await newNotification.save();

    manager.notifications.push(newNotification._id);
    await manager.save();

    const task = new Task({
      userId: manager._id,
      taskTitle: `Resolve Critical Issue on Machine ${machineId}`,
      description: `The machine ${machineId} is in critical condition due to ${issue}. Immediate action is required.`,
      scheduledDate: scheduledDate,
      isDone: false,
      priority: "high",
      taskType: "alert",
      isCritical: true,
      machineData: {
        machine_id: machineId,
        machineType: machineType,
        sensorData: sensorData,
      },
    });

    await task.save();

    manager.tasks.push(task._id);
    await manager.save();
  });
};
