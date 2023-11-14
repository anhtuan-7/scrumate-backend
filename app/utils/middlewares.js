const AppError = require('../errors/appError');
const { UNSUPPORTED_MEDIA_TYPE } = require('../common/statusCode');

exports.checkJsonContentType = (req, res, next) => {
  if (!req.is('application/json'))
    return next(
      new AppError(
        UNSUPPORTED_MEDIA_TYPE,
        'Content-Type must be application/json',
      ),
    );
  next();
};
