const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  refreshToken,
} = require("../controllers/authController");

const router = express.Router();

// Validation middleware for routes
const validateEmail = check("email", "Please include a valid email").isEmail();
const validatePassword = check(
  "password",
  "Password must be at least 6 characters"
).isLength({ min: 6 });
const validateRefreshToken = check(
  "refreshToken",
  "Refresh token is required"
).notEmpty();

// Register route
router.post("/register", [validateEmail, validatePassword], registerUser);

// Login route
router.post("/login", [validateEmail, validatePassword], loginUser);

// Refresh token route
router.post("/refresh-token", [validateRefreshToken], refreshToken);

module.exports = router;
