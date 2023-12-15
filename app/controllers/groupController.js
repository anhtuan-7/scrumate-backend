const { Op } = require('sequelize');
const { Group, GroupUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const { GROUP_NOT_FOUND } = require('../common/customCode');

exports.getGroupList = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { user } = res.locals;

  const { count, rows } = await Group.findAndCountAll({
    order: [
      [
        { model: GroupUser, as: 'groupUser' },
        filter.sort || 'joinedAt',
        filter.order,
      ],
    ],
    include: {
      model: GroupUser,
      as: 'groupUser',
      where: {
        userId: user.id,
        role: { [Op.ne]: 'inactive' },
      },
      attributes: ['role', 'lastAccessed', 'joinedAt'],
    },
    attributes: ['id', 'name', 'description'],
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
  const { groupId } = req.params;
  const { user } = res.locals;

  const group = await Group.findByPk(groupId, {
    include: {
      model: GroupUser,
      as: 'groupUser',
      attributes: ['role'],
    },
    raw: true,
    nest: true,
  });
  if (!group)
    return next(new AppError(NOT_FOUND, 'Group not found', GROUP_NOT_FOUND));

  // Asynchronous action
  GroupUser.update(
    { lastAccessed: new Date() },
    { where: { groupId, userId: user.id } },
  );

  res.status(OK).json({
    status: 'success',
    data: {
      group,
    },
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const { data, user } = res.locals;

  const group = await Group.create({
    ...data,
    creatorId: user.id,
  });

  res.status(CREATED).json({
    status: 'success',
    data: {
      group,
    },
  });
});
