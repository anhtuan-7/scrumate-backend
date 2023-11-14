const { OrganizationUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { FORBIDDEN } = require('../common/statusCode');

exports.checkUserRoleInOrganization = (...roles) => {
  if (roles.length === 0) roles = ['admin', 'project-admin', 'member'];
  return catchAsync(async (req, res, next) => {
    const data = await OrganizationUser.findOne({
      where: {
        userId: res.locals.user.id,
        organizationId: req.params.id,
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