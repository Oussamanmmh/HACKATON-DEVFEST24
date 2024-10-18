// logger.js
const logger = (req, res, next) => {
    const now = new Date();
    console.log(`[${now.toISOString()}] ${req.method} ${req.url}`);
    next();  // Pass control to the next middleware
  };
  
  module.exports = logger;
  