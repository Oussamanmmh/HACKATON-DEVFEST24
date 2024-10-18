// config/machineThresholds.js
const machineThresholds = {
  welding_robot_006: {
    weld_temperature: { worker: 1500, manager: 1700 }, // °C
    vibration_level: { worker: 0.5, manager: 1.0 }, // mm/s
    power_consumption: { worker: 3.0, manager: 5.0 }, // kWh
    weld_current: { worker: 140, manager: 160 }, // A
    weld_voltage: { worker: 28, manager: 35 }, // V
    weld_time: { worker: 400, manager: 600 }, // ms
    pressure_applied: { worker: 900, manager: 1100 }, // N
    gas_flow_rate: { worker: 18, manager: 25 }, // l/min
  },
  stamping_press_001: {
    temperature: { worker: 70, manager: 90 }, // °C
    vibration_level: { worker: 0.7, manager: 1.5 }, // mm/s
    power_consumption: { worker: 10.0, manager: 15.0 }, // kWh
    force_applied: { worker: 450, manager: 550 }, // tons
    cycle_time: { worker: 14, manager: 18 }, // seconds
    oil_pressure: { worker: 3.2, manager: 4.0 }, // bar
    noise_level: { worker: 80, manager: 90 }, // dB
    sheet_thickness: { worker: 1.1, manager: 1.5 }, // mm
  },
  painting_robot_002: {
    spray_pressure: { worker: 3.0, manager: 4.0 }, // bar
    paint_thickness: { worker: 110, manager: 140 }, // µm
    humidity: { worker: 50, manager: 70 }, // %RH
    paint_flow_rate: { worker: 3.5, manager: 5.0 }, // ml/min
    atomizer_speed: { worker: 18000, manager: 22000 }, // RPM
    overspray_capture_efficiency: { worker: 90, manager: 95 }, // %
    booth_airflow_velocity: { worker: 0.4, manager: 0.6 }, // m/s
    solvent_concentration: { worker: 5, manager: 10 }, // %
  },
  agv_003: {
    battery_level: { worker: 30, manager: 15 }, // %
    load_weight: { worker: 400, manager: 600 }, // kg
    speed: { worker: 1.0, manager: 1.5 }, // m/s
    distance_traveled: { worker: 1000, manager: 1500 }, // meters
    vibration_level: { worker: 0.3, manager: 0.5 }, // mm/s
    temperature: { worker: 32, manager: 40 }, // °C
    wheel_rotation_speed: { worker: 350, manager: 450 }, // RPM
  },
  cnc_milling_004: {
    spindle_speed: { worker: 11000, manager: 13000 }, // RPM
    vibration_level: { worker: 1.0, manager: 1.5 }, // mm/s
    power_consumption: { worker: 9.0, manager: 12.0 }, // kWh
    tool_wear_level: { worker: 30, manager: 50 }, // %
    cut_depth: { worker: 4, manager: 6 }, // mm
    coolant_flow_rate: { worker: 0.7, manager: 1.0 }, // ml/min
    material_hardness: { worker: 200, manager: 250 }, // HB
    chip_load: { worker: 0.3, manager: 0.5 }, // mm
  },
  leak_test_005: {
    test_pressure: { worker: 4.5, manager: 6.0 }, // bar
    pressure_drop: { worker: 0.015, manager: 0.025 }, // bar
    leak_rate: { worker: 0.1, manager: 0.3 }, // ml/min
    test_duration: { worker: 40, manager: 60 }, // seconds
    temperature: { worker: 24, manager: 30 }, // °C
    seal_condition: { worker: "good", manager: "warning" }, // Status
    fluid_type: { worker: "air", manager: "oil" }, // fluid type
    test_cycle_count: { worker: 1000, manager: 1500 }, // count
  },
};

module.exports = machineThresholds;
