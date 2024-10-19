const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId =  req.params.userId;
    const user = await User.findById(userId)
      .populate("tasks")
      .populate("notifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("tasks").populate("notifications");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.params.userId;
    const { name, email, role, phoneNumber, bio, language, profileImage } =
      req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, role, phoneNumber, bio, language, profileImage },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.params.userId;
    const user = await User.findById(userId).populate("tasks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user tasks", error });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : req.params.userId;
    const user = await User.findById(userId).populate("notifications");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.notifications);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user notifications", error });
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user ? req.user.id : req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};
