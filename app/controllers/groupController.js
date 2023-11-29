const { Group, GroupUser } = require('../models');
const { OK, CREATED } = require('../common/statusCode');
const catchAsync = require('../errors/catchAsync');
const getFilter = require('../utils/apiFilter');

exports.getGroupList = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { count, rows } = await GroupUser.findAndCountAll({
    where: { userId: res.locals.user.id },
    order: [[filter.sort, filter.order]], // sort by lastAccessed or joinAt
    limit: filter.limit,
    offset: filter.skip,
    include: {
      model: Group,
      as: 'data',
      attributes: ['id', 'name', 'description'],
    },
    attributes: ['role', 'lastAccessed', 'joinedAt'],
  });

  res.status(OK).json({
    status: 'success',
    results: rows.length,
    total: count,
    data: { groups: rows },
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id, {
    include: [], // projects
  });
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
