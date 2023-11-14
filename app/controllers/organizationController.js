const { User, Organization, OrganizationUser } = require('../models');
const { OK, CREATED } = require('../common/statusCode');
const catchAsync = require('../errors/catchAsync');
const getFilter = require('../utils/apiFilter');

exports.getOrganizationList = catchAsync(async (req, res, next) => {
  const userId = res.locals.user.id;
  const filter = getFilter(req);
  const organizations = await Organization.findAll({
    order: [[filter.sort, filter.order]],
    limit: filter.limit,
    offset: filter.skip,
    include: {
      model: User,
      attributes: [],
      through: OrganizationUser,
      where: { id: userId },
    },
  });
  res.status(OK).json({
    status: 'success',
    results: organizations.length,
    data: {
      organizations,
    },
  });
});

exports.getOrganization = catchAsync(async (req, res, next) => {
  const organization = await Organization.findByPk(req.params.id, {
    include: [],
  });
  res.status(OK).json({
    status: 'success',
    data: {
      organization,
    },
  });
});

exports.createOrganization = catchAsync(async (req, res, next) => {
  const { data } = res.locals;
  data.creatorId = res.locals.user.id;
  const organization = await Organization.create(data);
  res.status(CREATED).json({
    status: 'success',
    data: {
      organization,
    },
  });
});
