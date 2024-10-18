// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust the path based on your structure

// Middleware to authenticate JWT and add user info to req object
exports.authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expecting the token in 'Authorization: Bearer <token>'
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in your env vars
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};
