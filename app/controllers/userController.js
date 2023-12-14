const catchAsync = require('../errors/catchAsync');
const { User } = require('../models');
const AppError = require('../errors/appError');
const { NOT_FOUND, OK } = require('../common/statusCode');
const { USER_NOT_FOUND } = require('../common/customCode');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.query.email },
    attributes: ['id', 'email', 'name', 'avatar'],
  });

  if (!user)
    return next(new AppError(NOT_FOUND, 'User not found', USER_NOT_FOUND));

  return res.status(OK).json({
    status: 'success',
    data: { user },
  });
});
