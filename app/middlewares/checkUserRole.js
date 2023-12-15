const { GroupUser, ProjectUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { FORBIDDEN } = require('../common/statusCode');

/**
 * @description Checks whether the current user belongs to an existing group and has the necessary permissions to perform actions on it. 
  Use this middleware with create, update, or delete APIs.  
 * @param  {array} roles - An array of roles required for the user.
 * @throws Throws an error if the current user lacks the required role.
 */
exports.checkUserRoleInGroup = (...roles) => {
  if (roles.length === 0) {
    roles = ['group-admin', 'project-admin', 'member'];
  }

  return catchAsync(async (req, res, next) => {
    const { groupId } = req.params;
    const { user } = res.locals;

    const result = await GroupUser.findOne({
      where: { userId: user.id, groupId },
    });

    if (!result || !roles.includes(result.role)) {
      return next(
        new AppError(
          FORBIDDEN,
          'You do not have permission to perform this action',
        ),
      );
    }

    next();
  });
};

/**
 * @description Checks whether the current user belongs to an existing project and has the necessary permissions to perform actions on it. 
  Use this middleware with create, update, or delete APIs.  
 * @param  {array} roles - An array of roles required for the user.
 * @throws Throws an error if the current user lacks the required role.
 */
exports.checkUserRoleInProject = (...roles) => {
  if (roles.length === 0) {
    roles = ['scrum-master', 'product-owner', 'developer'];
  }

  return catchAsync(async (req, res, next) => {
    const { projectId } = req.params;
    const { user } = res.locals;

    const result = await ProjectUser.findOne({
      where: { userId: user.id, projectId },
    });

    if (!result || !roles.includes(result.role)) {
      return next(
        new AppError(
          FORBIDDEN,
          'You do not have permission to perform this action',
        ),
      );
    }

    next();
  });
};
