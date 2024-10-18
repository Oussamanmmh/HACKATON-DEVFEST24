const createError = require('http-errors');

// Custom Error Handler Class
class AppError extends Error {
  constructor(message, statusCode, errors = null) {  // Added 'errors' for validation details
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // 4xx are client errors, 5xx are server errors
    this.isOperational = true;
    this.errors = errors; // Store validation errors

    Error.captureStackTrace(this, this.constructor);
  }
}

// Catch Async Errors Wrapper
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Passing errors to the global error handler
  };
};

// Error handling for MongoDB CastError (invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;  // Custom message for invalid ObjectId
  return new AppError(message, 400);
};

// Error handling for MongoDB Validation Error
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);  // Collect all validation error messages
  const message = 'Invalid input data';
  return new AppError(message, 400, errors);  // Attach the array of validation errors
};

// Error handling for MongoDB Duplicate Fields (E11000)
const handleDuplicateFieldsDB = (err) => {
    // Extract the duplicated field and value from the error message
    const field = Object.keys(err.keyValue)[0]; // Get the field causing the duplicate error
    const value = err.keyValue[field]; // Get the duplicate value
    
    const message = `Duplicate field value for ${field}: "${value}". Please use another value!`;
    return new AppError(message, 400);
  };
  

// Error handling for MongoDB Limit Exceeded Error (e.g., MongoServerError when query exceeds limit)
const handleLimitErrorDB = (err) => {
  const message = 'Too many requests in a short time. Please slow down.';
  return new AppError(message, 429);  // 429 status for rate-limiting issues
};

// Error handling for MongoDB Invalid Collection Error
const handleInvalidCollectionDB = (err) => {
  const message = `Invalid operation: Collection '${err.collectionName}' not found.`;
  return new AppError(message, 400);
};

// Error handling for MongoDB Timeout
const handleTimeoutErrorDB = (err) => {
  const message = `Request to the database timed out: ${err.message}.`;
  return new AppError(message, 503);  // 503 status for service unavailable
};

// Global Error Handler Middleware
const globalErrorHandler = (err, req, res, next) => {
    // console.error('ERROR CAUGHT:', err);

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Handle MongoDB/Mongoose specific errors
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === 'ValidationError') err = handleValidationErrorDB(err);
    if (err.name === 'MongoServerError' && err.code === 86) err = handleLimitErrorDB(err);  // MongoDB limit exceeded
    if (err.name === 'MongoTimeoutError') err = handleTimeoutErrorDB(err);



    console.error('ERROR 💥', err); // Log error for debugging purposes
   
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      errors: err.errors || null,  // Include validation errors if available
    });

    
};

// Export the utilities
module.exports = {
  AppError,
  catchAsync,
  globalErrorHandler,
};
