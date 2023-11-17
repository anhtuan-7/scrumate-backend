const { User, Group, GroupUser } = require('../models');
const { OK, CREATED } = require('../common/statusCode');
const catchAsync = require('../errors/catchAsync');
const getFilter = require('../utils/apiFilter');

exports.getGroupList = catchAsync(async (req, res, next) => {
  const userId = res.locals.user.id;
  const filter = getFilter(req);
  const groups = await Group.findAll({
    order: [[filter.sort, filter.order]],
    limit: filter.limit,
    offset: filter.skip,
    include: {
      model: User,
      attributes: [],
      through: GroupUser,
      where: { id: userId },
    },
  });
  res.status(OK).json({
    status: 'success',
    results: groups.length,
    data: { groups },
  });
});

exports.getGroup = catchAsync(async (req, res, next) => {
  const group = await Group.findByPk(req.params.id, {
    include: [],
  });
  res.status(OK).json({
    status: 'success',
    data: { group },
  });
});

exports.createGroup = catchAsync(async (req, res, next) => {
  const { data } = res.locals;
  data.creatorId = res.locals.user.id;
  const group = await Group.create(data);
  res.status(CREATED).json({
    status: 'success',
    data: { group },
  });
});
