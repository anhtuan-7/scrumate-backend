const { GroupUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { FORBIDDEN } = require('../common/statusCode');

exports.checkUserRoleInGroup = (...roles) => {
  if (roles.length === 0) roles = ['admin', 'project-admin', 'member'];
  return catchAsync(async (req, res, next) => {
    const data = await GroupUser.findOne({
      where: {
        userId: res.locals.user.id,
        groupId: req.params.groupId, // actions that relate to a specific group
      },
    });
    if (data && roles.includes(data.role)) return next();
    return next(
      new AppError(
        FORBIDDEN,
        'You do not have permission to perform this action',
      ),
    );
  });
};
