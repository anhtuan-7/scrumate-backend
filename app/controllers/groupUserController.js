const { User, GroupUser, Project, ProjectUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND, FORBIDDEN } = require('../common/statusCode');
const { USER_NOT_FOUND } = require('../common/customCode');

exports.getGroupUserList = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { groupId } = req.params;

  const { count, rows } = await User.findAndCountAll({
    include: {
      model: GroupUser,
      as: 'group',
      attributes: ['role', 'lastAccessed', 'joinedAt'],
      where: { groupId },
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
  return res.status(OK).json({
    status: 'success',
    results: rows.length,
    total: count,
    data: {
      members: rows,
    },
  });
});

exports.addGroupUser = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const { data } = res.locals;

  const user = await User.findOne({ where: { email: data.email } });
  if (!user)
    return next(new AppError(NOT_FOUND, 'User not found', USER_NOT_FOUND));

  const groupUser = await GroupUser.create({
    userId: user.id,
    groupId,
    role: data.role,
  });
  return res.status(CREATED).json({
    status: 'success',
    data: {
      member: groupUser,
    },
  });
});

exports.getGroupUser = catchAsync(async (req, res, next) => {
  const { groupId, userId } = req.params;

  const user = await User.findByPk(userId, {
    include: [
      {
        model: GroupUser,
        as: 'group',
        where: { groupId },
        attributes: [],
      },
      {
        model: Project,
        through: {
          model: ProjectUser,
          attributes: ['role'],
        },
        attributes: ['name'],
      },
    ],
    attributes: ['id', 'name', 'email'],
  });

  if (!user)
    return next(new AppError(NOT_FOUND, 'Member not found', USER_NOT_FOUND));

  return res.status(OK).json({
    status: 'success',
    data: {
      member: user,
    },
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const { userId, groupId } = req.params;
  const { user, data } = res.locals;

  if (parseInt(userId, 10) === user.id)
    return next(new AppError(FORBIDDEN, 'You can not change your own role'));

  const [affectedCount] = await GroupUser.update(
    { ...data },
    { where: { groupId, userId } },
  );

  return res.status(OK).json({
    status: 'success',
    data: {
      affectedCount,
    },
  });
});
