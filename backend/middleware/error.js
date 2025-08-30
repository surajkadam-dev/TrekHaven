class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleWare = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value: ${field}. Please use another value!`;
    err = new ErrorHandler(message, 400);
  }

  // Send response - ONLY status and message
  return res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message
  });
};

export default ErrorHandler;