const AppError = require('../errors/appError');
const { BAD_REQUEST } = require('../common/statusCode');

const validate = (schema, errorCode = BAD_REQUEST) => {
  return (req, res, next) => {
    const result = schema
      .options({
        stripUnknown: true,
      })
      .validate(req.body);
    if (result.error) {
      const { message } = result.error.details[0];
      return next(new AppError(errorCode, message));
    }
    res.locals.data = result.value;
    next();
  };
};

module.exports = validate;
