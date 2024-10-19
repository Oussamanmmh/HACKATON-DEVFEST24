// controllers/fileController.js
const { uploadFileToFirebase } = require("../services/firebaseService");
const { AppError } = require("../utils/errorHandler");

exports.uploadAttachment = async (req, res, next) => {
  try {
    // Check if a file was uploaded
    if (!req.file) {
      throw new AppError("No file uploaded", 400);
    }

    const file = req.file; // Access the uploaded file via multer
    const fileUrl = await uploadFileToFirebase(file, "uploads");

    // Respond with success and the file URL
    return res.status(200).json({
      success: true,
      fileUrl,
    });
  } catch (error) {
    console.error("Error uploading file:", error); // Log the error

    // Handle errors and send an error response
    return res.status(500).json({
      status: "error",
      message: "An error occurred while uploading the file.",
      error: error.message || "Unknown error",
    });
  }
};
