// config/machineThresholds.js
const machineThresholds = {
    welding_robot_006: {
      weld_temperature: { worker: 1500, manager: 1700 },      // °C
      vibration_level: { worker: 0.5, manager: 1.0 },         // mm/s
      power_consumption: { worker: 3.0, manager: 5.0 },       // kWh
    },
    stamping_press_001: {
      temperature: { worker: 70, manager: 90 },               // °C
      vibration_level: { worker: 0.7, manager: 1.5 },         // mm/s
      power_consumption: { worker: 10.0, manager: 15.0 },     // kWh
    },
    painting_robot_002: {
      spray_pressure: { worker: 3.0, manager: 4.0 },          // bar
      paint_thickness: { worker: 110, manager: 140 },         // µm
      humidity: { worker: 50, manager: 70 },                  // %RH
    },
    agv_003: {
      battery_level: { worker: 30, manager: 15 },             // %
      load_weight: { worker: 400, manager: 600 },             // kg
      speed: { worker: 1.0, manager: 1.5 },                   // m/s
    },
    cnc_milling_004: {
      spindle_speed: { worker: 11000, manager: 13000 },       // RPM
      vibration_level: { worker: 1.0, manager: 1.5 },         // mm/s
      power_consumption: { worker: 9.0, manager: 12.0 },      // kWh
    },
    leak_test_005: {
      test_pressure: { worker: 4.5, manager: 6.0 },           // bar
      pressure_drop: { worker: 0.015, manager: 0.025 },       // bar
      leak_rate: { worker: 0.1, manager: 0.3 },               // ml/min
    }
  };
  
  module.exports = machineThresholds;
 