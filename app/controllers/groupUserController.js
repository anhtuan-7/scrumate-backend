const { User, GroupUser, Project, ProjectUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND, FORBIDDEN } = require('../common/statusCode');
const { USER_NOT_FOUND } = require('../common/customCode');

exports.getGroupMember = catchAsync(async (req, res, next) => {
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

exports.addGroupMember = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const { data } = res.locals;

  const user = await User.findOne({ where: { email: data.email } });
  if (!user)
    return next(new AppError(NOT_FOUND, 'User not found', USER_NOT_FOUND));

  const member = await GroupUser.create({
    userId: user.id,
    groupId,
    role: data.role,
  });
  return res.status(CREATED).json({
    status: 'success',
    data: {
      member,
    },
  });
});

exports.getMemberDetail = catchAsync(async (req, res, next) => {
  const { groupId, memberId } = req.params;

  const member = await User.findByPk(memberId, {
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

  if (!member)
    return next(new AppError(NOT_FOUND, 'Member not found', USER_NOT_FOUND));

  return res.status(OK).json({
    status: 'success',
    data: {
      member,
    },
  });
});

exports.changeMemberRole = catchAsync(async (req, res, next) => {
  const { memberId: userId, groupId } = req.params;
  const { user, data } = res.locals;

  if (userId === user.id)
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
