const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const { GROUP_NOT_FOUND } = require('../common/customCode');
const { Group, GroupUser } = require('../models');

exports.getGroupList = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { count, rows } = await Group.findAndCountAll({
    include: {
      model: GroupUser,
      as: 'groupUser',
      where: { userId: res.locals.user.id },
      attributes: ['role', 'lastAccessed', 'joinedAt'],
    },
    attributes: ['id', 'name', 'description'],
    order: [
      [
        { model: GroupUser, as: 'groupUser' },
        filter.sort || 'joinedAt',
        filter.order,
      ],
    ],
    limit: filter.limit,
    offset: filter.skip,
    raw: true,
    nest: true,
  });

  res.status(OK).json({
    status: 'success',
    results: rows.length,
    total: count,
    data: { groups: rows },
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByPk(req.params.groupId, {
    include: {
      model: GroupUser,
      as: 'groupUser',
      attributes: ['role'],
      where: { userId: res.locals.user.id },
    },
    raw: true,
    nest: true,
  });
  if (!group)
    return next(new AppError(NOT_FOUND, 'Group not found', GROUP_NOT_FOUND));
  res.status(OK).json({
    status: 'success',
    data: { group },
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const group = await Group.create({
    ...res.locals.data,
    creatorId: res.locals.user.id,
  });
  res.status(CREATED).json({
    status: 'success',
    data: { group },
  });
});
