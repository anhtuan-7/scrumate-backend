const catchAsync = require('../errors/catchAsync');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED } = require('../common/statusCode');
const { Project, ProjectUser } = require('../models');

exports.getProjectList = catchAsync(async (req, res, next) => {
  const where = {};
  if (req.params.groupId) where.groupId = req.params.groupId;

  const filter = getFilter(req);
  const { count, rows } = await Project.findAndCountAll({
    where,
    include: {
      model: ProjectUser,
      as: 'projectUser',
      where: { userId: res.locals.user.id },
      attributes: ['role', 'lastAccessed', 'joinedAt'],
    },
    attributes: ['id', 'name', 'key', 'description', 'repository'],
    order: [
      [
        { model: ProjectUser, as: 'projectUser' },
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
    total: count,
    results: rows.length,
    data: {
      projects: rows,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {});

exports.createProject = catchAsync(async (req, res, next) => {
  const project = await Project.create({
    ...res.locals.data,
    groupId: req.params.groupId,
    creatorId: res.locals.user.id,
  });
  res.status(CREATED).json({
    status: 'success',
    data: { project },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const affectedRow = await Project.update(res.locals.data, {
    where: { id: req.params.projectId },
  });
  return res.status(OK).json({
    status: 'success',
    data: {
      affectedRow,
    },
  });
});
