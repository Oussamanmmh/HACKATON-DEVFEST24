const User = require("../models/User");
const bcrypt = require("bcrypt");

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("tasks").populate("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("tasks").populate("notifications");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, phoneNumber, bio, language, profileImage } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        name,
        email,
        role,
        phoneNumber,
        bio,
        language,
        profileImage,
      },
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

// Delete a user by ID
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

// Get user tasks by user ID
exports.getUserTasks = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("tasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user tasks", error });
  }
};

// Get user notifications by user ID
exports.getUserNotifications = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("notifications");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user notifications", error });
  }
};

// Change user password
exports.changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};
