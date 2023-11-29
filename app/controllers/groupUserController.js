const catchAsync = require('../errors/catchAsync');
const { User, Group, GroupUser } = require('../models');
const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const AppError = require('../errors/appError');
const { USER_NOT_FOUND } = require('../common/customCode');

exports.getGroupMember = catchAsync(async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: {
      model: User,
      through: {
        model: GroupUser,
        as: 'metadata',
        attributes: ['role', 'lastAccessed', 'joinedAt'],
      },
      attributes: ['id', 'name', 'email'],
    },
  });
  return res.status(OK).json({
    status: 'success',
    results: group.users.length,
    data: { members: group.users },
  });
});

exports.addGroupMember = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ where: { email: res.locals.data.email } });
  if (!user)
    return next(new AppError(NOT_FOUND, 'User not found', USER_NOT_FOUND));

  const member = await GroupUser.create({
    userId: user.id,
    groupId: req.params.groupId,
    role: res.locals.data.role,
  });
  return res.status(CREATED).json({
    status: 'success',
    data: {
      member,
    },
  });
});

exports.changeMemberRole = catchAsync(async (req, res, next) => {
  const affectedRow = await GroupUser.update(
    { role: res.locals.data.role },
    {
      where: {
        groupId: req.params.groupId,
        userId: res.locals.data.userId,
      },
    },
  );
  return res.status(OK).json({
    status: 'success',
    data: {
      affectedRow,
    },
  });
});
