const mongoose = require("mongoose");

// MongoDB connection function
const connectDB = async () => {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect("mongodb://localhost:27017/unes", {});

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure if the connection fails
  }
};

// Export the connection function
module.exports = connectDB;
