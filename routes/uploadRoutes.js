const express = require("express");
const router = express.Router();
const { uploadAttachment } = require("../controllers/uploadController.js");
const multer = require("multer");

// Set up multer to handle multi-part form data
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });

// Upload image
router.post("/any", upload.single("attachment"), uploadAttachment);

// Upload pdf

module.exports = router;
