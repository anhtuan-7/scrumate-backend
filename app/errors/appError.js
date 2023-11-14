class AppError extends Error {
  constructor(statusCode, message, code = undefined) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isKnown = true; // Under control errors
    this.code = code; // Custom code

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
