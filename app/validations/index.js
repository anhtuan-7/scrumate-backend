const AppError = require('../errors/appError');
const { BAD_REQUEST } = require('../common/statusCode');

const validate = (schema, statusCode = BAD_REQUEST) => {
  return (req, res, next) => {
    const result = schema
      .options({
        stripUnknown: true,
      })
      .validate(req.body);
    if (result.error) {
      const { message } = result.error.details[0];
      return next(new AppError(statusCode, message));
    }
    res.locals.data = result.value;
    next();
  };
};

module.exports = validate;
