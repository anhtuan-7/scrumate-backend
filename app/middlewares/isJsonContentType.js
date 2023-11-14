const AppError = require('../errors/appError');
const { UNSUPPORTED_MEDIA_TYPE } = require('../common/statusCode');

const isJsonContentType = (req, res, next) => {
  if (!req.is('application/json'))
    return next(
      new AppError(
        UNSUPPORTED_MEDIA_TYPE,
        'Content-Type must be application/json',
      ),
    );
  next();
};

module.exports = isJsonContentType;
