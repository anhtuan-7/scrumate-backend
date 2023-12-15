const bcrypt = require('bcrypt');
const User = require('../models/user');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { signToken, setTokenCookie } = require('../utils/auth');
const { OK, CREATED, UNAUTHORIZED, CONFLICT } = require('../common/statusCode');
const {
  EMAIL_ALREADY_EXISTS,
  WRONG_PASSWORD,
} = require('../common/customCode');

const setTokenAndRespond = (res, user, statusCode) => {
  const token = signToken(user.id);
  res = setTokenCookie(res, token);
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { data } = res.locals;

  const existingUser = await User.findOne({
    where: { email: data.email },
  });

  if (existingUser)
    return next(
      new AppError(CONFLICT, 'Email already exists', EMAIL_ALREADY_EXISTS),
    );

  const user = await User.create(data);
  setTokenAndRespond(res, user, CREATED);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = res.locals.data;

  const user = await User.findOne({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password)))
    return next(
      new AppError(UNAUTHORIZED, 'Wrong username or password', WRONG_PASSWORD),
    );

  setTokenAndRespond(res, user, OK);
});

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(OK).json({
    status: 'success',
    data: {},
  });
};
