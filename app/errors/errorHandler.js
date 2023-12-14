const { Sequelize } = require('sequelize');
const AppError = require('./appError');
const {
  INTERNAL_SERVER_ERROR,
  BAD_REQUEST,
  UNAUTHORIZED,
} = require('../common/statusCode');

const handlePostgresError = (err) => {
  // console.log(err)
  let message = `[${err.message}] `;
  if (err.errors)
    message = message.concat(`${err.errors[0].type}: ${err.errors[0].message}`);
  return new AppError(BAD_REQUEST, message);
};

const handleJwtError = (err) => {
  const message = `Token error: ${err.message}`;
  return new AppError(UNAUTHORIZED, message);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    code: err.code,
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (!err.isKnown)
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Something went wrong',
    });

  res.status(err.statusCode).json({
    status: err.status,
    code: err.code, // Custom code
    message: err.message,
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  // if (process.env.NODE_ENV === 'development') return sendErrorDev(err, res);
  if (err instanceof Sequelize.BaseError) err = handlePostgresError(err);
  if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError')
    err = handleJwtError(err);
  if (process.env.NODE_ENV === 'development') return sendErrorDev(err, res);
  sendErrorProd(err, res);
};

module.exports = errorHandler;
