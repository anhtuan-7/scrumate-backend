const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const { USER_NOT_FOUND } = require('../common/customCode');
const { User, GroupUser } = require('../models');

exports.getGroupMember = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { count, rows } = await User.findAndCountAll({
    order: [
      [
        { model: GroupUser, as: 'group' },
        filter.sort || 'joinedAt',
        filter.order,
      ],
    ],
    limit: filter.limit,
    offset: filter.skip,
    include: {
      model: GroupUser,
      as: 'group',
      attributes: ['role', 'lastAccessed', 'joinedAt'],
      where: { groupId: req.params.groupId },
    },
    attributes: ['id', 'email', 'name'],
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
