const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt');

// Register user
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'failed',
      message: 'Validation errors',
      errors: errors.array(),
    });
  }

  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // Generate access token and refresh token
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      accessToken: {
        token: accessToken,
        expiresOn: process.env.JWT_ACCESS_EXPIRES_IN,
      },
      refreshToken: {
        token: refreshToken,
        expiresOn: process.env.JWT_REFRESH_EXPIRES_IN,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'failed',
        message: 'Validation errors',
        errors: errors.array(),
      });
    }
  
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User not found' });
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Password Incorrect' });
  
      // Generate access token and refresh token
      const accessToken = generateAccessToken(user.id);
      const refreshToken = generateRefreshToken(user.id);
  
      // Store refresh token in the database
      user.refreshToken = refreshToken;
      await user.save();
  
      res.status(200).json({
        accessToken: {
          token: accessToken,
          expiresOn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
        refreshToken: {
          token: refreshToken,
          expiresOn: process.env.JWT_REFRESH_EXPIRES_IN,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  };


  exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;
  
    if (!refreshToken) {
      return res.status(401).json({ msg: 'No refresh token provided' });
    }
  
    try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  
      // Find the user by ID
      const user = await User.findOne({ id: decoded.id });
  
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ msg: 'Invalid refresh token' });
      }
  
      // Generate a new access token
      const accessToken = generateAccessToken(user.id);
  
      return res.status(200).json({
        accessToken: {
          token: accessToken,
          expiresOn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      });
    } catch (error) {
      console.error('Error verifying refresh token:', error);
      return res.status(403).json({ msg: 'Invalid or expired refresh token' });
    }
  };
  
  