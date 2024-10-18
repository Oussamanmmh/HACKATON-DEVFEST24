const Task = require("../models/taskModel");

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { userId, taskTitle, description, scheduledDate, isCritical, machineData } = req.body;

    const newTask = new Task({
      userId,
      taskTitle,
      description,
      scheduledDate,
      isCritical,
      machineData
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("userId", "name email");
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("userId", "name email");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error retrieving task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a task by ID
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the updated document
      runValidators: true // Run schema validators
    });

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mark task as done
exports.markTaskAsDone = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.isDone = true;
    await task.save();

    res.status(200).json({ message: "Task marked as done", task });
  } catch (error) {
    console.error("Error marking task as done:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// Get tasks by user ID
exports.getTasksByUserId = async (req, res) => {
    try {
      const userId = req.params.userId; // Get user ID from request params
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
  