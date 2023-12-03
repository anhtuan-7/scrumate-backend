const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const { PROJECT_NOT_FOUND } = require('../common/customCode');
const { Project, ProjectUser, Group } = require('../models');

exports.getProjectList = catchAsync(async (req, res, next) => {
  const query = {
    include: [
      {
        model: ProjectUser,
        as: 'projectUser',
        where: { userId: res.locals.user.id },
        attributes: ['role', 'lastAccessed', 'joinedAt'],
      },
    ],
    attributes: ['id', 'name', 'key', 'description', 'repository'],
  };
  if (req.params.groupId) query.where = { groupId: req.params.groupId };
  else {
    query.include.push({
      model: Group,
      attributes: ['id', 'name'],
    });
  }

  const filter = getFilter(req);
  const { count, rows } = await Project.findAndCountAll({
    ...query,
    order: [
      [
        { model: ProjectUser, as: 'projectUser' },
        filter.sort || 'joinedAt',
        filter.order,
      ],
    ],
    limit: filter.limit,
    offset: filter.skip,
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

exports.getProject = catchAsync(async (req, res, next) => {
  const project = await Project.findByPk(req.params.projectId);
  if (!project)
    return next(
      new AppError(NOT_FOUND, 'Project not found', PROJECT_NOT_FOUND),
    );
  res.status(OK).json({
    status: 'success',
    data: { project },
  });
});

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
