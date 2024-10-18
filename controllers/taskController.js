const Task = require("../models/taskModel");

exports.createTask = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;

    const { taskTitle, description, scheduledDate, isCritical, machineData } =
      req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newTask = new Task({
      userId,
      taskTitle,
      description,
      scheduledDate,
      isCritical,
      machineData,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("userId", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate(
      "userId",
      "name email"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.markTaskAsDone = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const task = await Task.findOne({ _id: req.params.id, userId });
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found or user not authorized" });
    }

    task.isDone = true;
    await task.save();

    res.status(200).json({ message: "Task marked as done", task });
  } catch (error) {
    console.error("Error marking task as done:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTasksByUserId = async (req, res) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const tasks = await Task.find({ userId }).populate("userId", "name email");

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks by user ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
