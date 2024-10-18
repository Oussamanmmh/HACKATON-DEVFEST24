const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const webhookRoutes = require("./routes/webhookRoutes"); 

const app = express();


app.use(bodyParser.json());


const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://younes:younes@cluster0.8fm7l.mongodb.net/sensorDb?retryWrites=true&w=majority",
    );

    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1); 
  }
};

connectDB();

app.use("/webhook-v1", webhookRoutes); 


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
