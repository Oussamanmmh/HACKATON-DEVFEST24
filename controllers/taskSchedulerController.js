const { GoogleGenerativeAI } = require("@google/generative-ai");
const MachineLog = require("../models/machineLogModel");
const TaskSchedule = require("../models/TaskSchedule");
const { sendPushNotification } = require("../services/firebaseService");
const Notification = require("../models/Notification");
const Task = require("../models/taskModel");
const User = require("../models/User");

const API_KEY = "AIzaSyCjOOqsIN_KuT26wdTrG0fz0tpPyXy2ULw";
const genAI = new GoogleGenerativeAI(API_KEY);

exports.generateTaskSchedule = async (req, res) => {
  try {
    const machineLogs = await MachineLog.find()
      .sort({ timestamp: -1 })
      .limit(30);

    if (!machineLogs || machineLogs.length === 0) {
      return res.status(404).json({ error: "No logs found." });
    }

    const prompt = `
    You are analyzing machine logs from a manufacturing plant. There are 6 different machines, and you will receive the last 30 logs for each machine. These machines are critical to plant operations, and their maintenance and operational health are regularly monitored.

    ### Machines:
    1. Welding Robot (ID: welding_robot_006)
    2. Stamping Press (ID: stamping_press_001)
    3. Painting Robot (ID: painting_robot_002)
    4. Automated Guided Vehicle (AGV) (ID: agv_003)
    5. CNC Milling Machine (ID: cnc_milling_004)
    6. Leak Test Machine (ID: leak_test_005)

    ### Logs:
    You will receive log data in the following structure:
    \`\`\`json
    ${JSON.stringify(machineLogs)}
    \`\`\`

    ### Your Task:
    1. You will analyze the last 30 logs for each of the 6 machines.
    2. Based on the analysis, you will determine the necessary actions for each machine, such as "recharge", "maintenance", "inspection", etc.
    3. For each machine, generate a task schedule starting from today, based on the criticality of the warnings or sensor readings.
    4. You should prioritize machines based on their criticality: if a machine has received critical warnings, schedule tasks earlier with higher priority.
    5. You will provide a JSON schedule for each machine that includes the following fields:
       - machine_id: The ID of the machine
       - action: The task that needs to be performed (e.g., "recharge", "maintenance")
       - scheduled_date: The date and time when the task should be performed, starting from today ${new Date().toISOString()}
       - priority: Either "high", "medium", or "low" depending on the machine's health and warning severity
       - worker_role: The role of the worker that should handle the task (e.g., "technician", "operator")

    ### Example of Expected Output:
    \`\`\`json
    {
      "schedule": [
        {
          "machine_id": "leak_test_005",
          "action": "maintenance",
          "scheduled_date": "2024-10-20T09:00:00Z",
          "priority": "high",
          "worker_role": "technician"
        },
        {
          "machine_id": "agv_003",
          "action": "recharge",
          "scheduled_date": "2024-10-19T10:00:00Z",
          "priority": "medium",
          "worker_role": "operator"
        },
        {
          "machine_id": "welding_robot_006",
          "action": "inspection",
          "scheduled_date": "2024-10-21T08:00:00Z",
          "priority": "low",
          "worker_role": "technician"
        },
        {
          "machine_id": "cnc_milling_004",
          "action": "inspection",
          "scheduled_date": "2024-10-19T14:00:00Z",
          "priority": "medium",
          "worker_role": "technician"
        },
        {
          "machine_id": "painting_robot_002",
          "action": "maintenance",
          "scheduled_date": "2024-10-21T11:00:00Z",
          "priority": "high",
          "worker_role": "technician"
        },
        {
          "machine_id": "stamping_press_001",
          "action": "inspection",
          "scheduled_date": "2024-10-22T12:00:00Z",
          "priority": "low",
          "worker_role": "operator"
        }
      ]
    }
    \`\`\`

    ### Requirements:
    - only generate json we asked for and nothing else because your answer will be used in  
      const schedule = JSON.parse(result.response.text());
    - The array should contain exactly 6 elements, one for each machine.
    - Each machine should have a scheduled task based on the severity of its warnings or sensor data.
    - You should ensure that tasks with critical warnings (e.g., "danger") are scheduled earlier with higher priority.
    - The worker role can vary depending on the task type, such as "technician" for maintenance or "operator" for a recharge task.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    const cleanResponse = result.response.text().replace(/```json|```/g, "");
    const schedule = JSON.parse(cleanResponse);

    for (const task of schedule.schedule) {
      const newTask = new TaskSchedule({
        machine_id: task.machine_id,
        action: task.action,
        scheduled_date: task.scheduled_date,
        priority: task.priority,
        worker_role: task.worker_role,
      });

      await newTask.save();

      if (task.priority === "high" || task.priority === "medium") {
        console.log("user notified");
        await notifyWorker(
          task.machine_id,
          task.action,
          task.scheduled_date,
          task.worker_role
        );
      }
    }

    return res
      .status(200)
      .json({ message: "Task schedule generated successfully.", schedule });
  } catch (error) {
    console.error("Error generating schedule:", error);
    return res.status(500).json({ error: "Error generating schedule." });
  }
};

const notifyWorker = async (machineId, action, scheduledDate, workerRole) => {
  const workers = await User.find({});

  workers.forEach(async (worker) => {
    if (worker.notificationsToken) {
      sendPushNotification(
        worker.notificationsToken,
        `Task Assigned: ${action}`,
        `Machine ${machineId} requires ${action}.`
      );
    }

    const now = new Date();
    let taskScheduledDate = new Date(scheduledDate);

    const startOfWorkDay = new Date(now.setHours(9, 0, 0, 0));
    const endOfWorkDay = new Date(now.setHours(18, 0, 0, 0));

    if (now >= startOfWorkDay && now <= endOfWorkDay) {
      taskScheduledDate = new Date();
    } else if (now < startOfWorkDay) {
      taskScheduledDate = startOfWorkDay;
    } else {
      taskScheduledDate = new Date(now.setDate(now.getDate() + 1));
      taskScheduledDate.setHours(9, 0, 0, 0);
    }

    const newNotification = new Notification({
      userId: worker._id,
      title: `Task Assigned: ${action}`,
      message: `Machine ${machineId} requires ${action}.`,
      machineId: machineId,
    });
    await newNotification.save();

    worker.notifications.push(newNotification._id);
    await worker.save();

    const task = new Task({
      userId: worker._id,
      taskTitle: `${action} for Machine ${machineId}`,
      description: `Please perform ${action} on Machine ${machineId}.`,
      scheduledDate: taskScheduledDate,
      isDone: false,
      taskType: "maintenance",
      machineData: {
        machine_id: machineId,
        action: action,
      },
    });

    console.log("Task created:", task);

    await task.save();

    worker.tasks.push(task._id);
    await worker.save();
  });
};
