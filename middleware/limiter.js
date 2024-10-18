const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 100, 
  message: {
    msg: 'Too many requests, please try again later.',
  },
  headers: true, 
});

module.exports = limiter;
