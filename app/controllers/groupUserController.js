const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND, FORBIDDEN } = require('../common/statusCode');
const { USER_NOT_FOUND } = require('../common/customCode');
const { User, GroupUser } = require('../models');

exports.getGroupMember = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { count, rows } = await User.findAndCountAll({
    include: {
      model: GroupUser,
      as: 'group',
      attributes: ['role', 'lastAccessed', 'joinedAt'],
      where: { groupId: req.params.groupId },
    },
    attributes: ['id', 'email', 'name'],
    order: [
      [
        { model: GroupUser, as: 'group' },
        filter.sort || 'joinedAt',
        filter.order,
      ],
    ],
    limit: filter.limit,
    offset: filter.skip,
    raw: true,
    nest: true,
  });
  return res.json({
    status: 'success',
    results: rows.length,
    total: count,
    data: {
      members: rows,
    },
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
  const { userId } = res.locals.data;

  if (userId === res.locals.user.id)
    return next(new AppError(FORBIDDEN, 'You can not change your own role'));

  const affectedRow = await GroupUser.update(
    { role: res.locals.data.role },
    {
      where: {
        groupId: req.params.groupId,
        userId: userId,
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
