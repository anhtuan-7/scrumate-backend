const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { hasPasswordChanged } = require('../utils/auth');
const { UNAUTHORIZED, NOT_FOUND } = require('../common/statusCode');
const { USER_NOT_FOUND, INVALID_TOKEN } = require('../common/customCode');

const verifyToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token)
    return next(
      new AppError(
        UNAUTHORIZED,
        'Token not found! Please login to get access',
        40101,
      ),
    );

  const decodedPayload = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET,
  );

  const user = await User.findByPk(decodedPayload.id);
  if (!user)
    return next(
      new AppError(NOT_FOUND, 'User not found on server', USER_NOT_FOUND),
    );

  if (hasPasswordChanged(user.passwordChangedAt, decodedPayload.iat))
    return next(
      new AppError(
        UNAUTHORIZED,
        'User has recently changed password! Please log in again',
        INVALID_TOKEN,
      ),
    );

  res.locals.user = user;
  next();
});

module.exports = verifyToken;
