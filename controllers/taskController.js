const Task = require("../models/taskModel");
const User = require("../models/User");

exports.createTask = async (req, res) => {
  try {
    const { taskTitle, description, scheduledDate, isCritical, machineData } =
      req.body;

    const newTask = new Task({
      userId: req.user._id,
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
    const tasks = await Task.find({ userId: req.user._id }).populate(
      "userId",
      "name email"
    );
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("userId", "name email");
    if (!task) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to access it",
      });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to update it",
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to delete it",
      });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.markTaskAsDone = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found or you don't have permission to update it",
      });
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
    const tasks = await Task.find({ userId: req.user._id }).populate(
      "userId",
      "name email"
    );

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks by user ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
