const catchAsync = (asyncFunc) => {
  return function (req, res, next) {
    asyncFunc(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
