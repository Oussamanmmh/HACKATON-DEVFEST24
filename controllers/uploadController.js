// controllers/fileController.js
const { uploadFileToFirebase } = require("../services/firebaseService");
const { AppError } = require("../utils/errorHandler");

// Upload Attachment (without catchAsync)
exports.uploadAttachment = async (req, res, next) => {
  try {
    // Check if files were uploaded
    if (!req.files || !req.files.attachment) {
      return next(new AppError("No file uploaded", 400)); // Custom error handling
    }

    const file = req.files.attachment; // This gets the uploaded file
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
