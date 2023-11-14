const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_AGE}`, // days
  });

const setTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_AGE),
    httpOnly: true,
  };
  res.cookie('jwt', token, cookieOptions);
  return res;
};

const hasPasswordChanged = (passwordChangedAt, tokenIat) => {
  if (!passwordChangedAt) return false;
  const timestamp = parseInt(passwordChangedAt.getTime() / 1000, 10);
  return timestamp > tokenIat;
};

module.exports = {
  hashPassword,
  setTokenCookie,
  signToken,
  hasPasswordChanged,
};
