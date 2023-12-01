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
  if (roles.length === 0) roles = ['admin', 'project-admin', 'member'];
  return catchAsync(async (req, res, next) => {
    const groupId = req.params.groupId || res.locals.data.groupId;
    const userId = res.locals.user.id;

    const data = await GroupUser.findOne({ where: { userId, groupId } });
    if (data && roles.includes(data.role)) return next();
    return next(
      new AppError(
        FORBIDDEN,
        'You do not have permission to perform this action',
      ),
    );
  });
};

/**
 * @description Checks whether the current user belongs to an existing project and has the necessary permissions to perform actions on it. 
  Use this middleware with create, update, or delete APIs.  
 * @param  {array} roles - An array of roles required for the user.
 * @throws Throws an error if the current user lacks the required role.
 */
exports.checkUserRoleInProject = (...roles) => {
  if (roles.length === 0)
    roles = ['scrum-master', 'product-owner', 'developer'];
  return catchAsync(async (req, res, next) => {
    const projectId = req.params.projectId || res.locals.data.projectId;
    const userId = res.locals.user.id;

    const data = await ProjectUser.findOne({ where: { userId, projectId } });
    if (data && roles.includes(data.role)) return next();
    return next(
      new AppError(
        FORBIDDEN,
        'You do not have permission to perform this action',
      ),
    );
  });
};
