if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();

  require("events").EventEmitter.defaultMaxListeners = 10000;
} else {
  console.log("Running in production mode");
}

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const http = require("http");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const { Server } = require("socket.io");

const logger = require("./middlewares/logger");
const { globalErrorHandler } = require("./utils/errorHandler");
const webhookRoutes = require("./routes/webhookRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb+srv://younes:younes@cluster0.8fm7l.mongodb.net/sensorDb?retryWrites=true&w=majority",
      {}
    );
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
connectDB();

app.use(bodyParser.json());
// app.use(fileUpload());
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
// app.use(fileUpload());

app.use(logger);

// import routes
const authRoutes = require("./routes/authRoutes");
const uploadAttachment = require("./routes/uploadRoutes");
const machineThresholdRoutes = require("./routes/machineThresholdRoutes");
const taskRoutes = require("./routes/taskRoutes");

// routes

app.use("/api/machine-thresholds", machineThresholdRoutes);
app.use("/webhook-v1", webhookRoutes);
app.use("/upload", uploadAttachment);
app.use("/auth", authRoutes);
app.use("/api", taskRoutes);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
