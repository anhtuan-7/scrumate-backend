const { Op } = require('sequelize');
const { Project, ProjectUser, Group } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const { PROJECT_NOT_FOUND } = require('../common/customCode');

exports.getProjectList = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { groupId } = req.params;
  const { user } = res.locals;

  const query = {
    order: [
      [
        { model: ProjectUser, as: 'projectUser' },
        filter.sort || 'joinedAt',
        filter.order,
      ],
    ],
    include: [
      {
        model: ProjectUser,
        as: 'projectUser',
        where: {
          userId: user.id,
          role: { [Op.ne]: 'inactive' },
        },
        attributes: ['role', 'lastAccessed', 'joinedAt'],
      },
    ],
    attributes: ['id', 'name', 'key', 'description', 'repository'],
    limit: filter.limit,
    offset: filter.skip,
    raw: true,
    nest: true,
  };

  if (groupId) query.where = { groupId };
  else {
    query.include.push({
      model: Group,
      attributes: ['id', 'name'],
    });
  }

  const { count, rows } = await Project.findAndCountAll(query);

  return res.status(OK).json({
    status: 'success',
    total: count,
    results: rows.length,
    data: {
      projects: rows,
    },
  });
});

exports.createProject = catchAsync(async (req, res, next) => {
  const { groupId } = req.params;
  const { user, data } = res.locals;

  const project = await Project.create({
    ...data,
    groupId,
    creatorId: user.id,
  });

  res.status(CREATED).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.getProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { user } = res.locals;

  const project = await Project.findByPk(projectId, {
    include: {
      model: ProjectUser,
      as: 'projectUser',
      attributes: ['role', 'lastAccessed', 'joinedAt'],
    },
    attributes: ['id', 'name', 'key'],
    raw: true,
    nest: true,
  });

  if (!project)
    return next(
      new AppError(NOT_FOUND, 'Project not found', PROJECT_NOT_FOUND),
    );

  // Asynchronous action
  ProjectUser.update(
    { lastAccessed: new Date() },
    { where: { projectId, userId: user.id } },
  );

  res.status(OK).json({
    status: 'success',
    data: {
      project,
    },
  });
});

exports.updateProject = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { data } = res.locals;

  const affectedRow = await Project.update(data, {
    where: { id: projectId },
  });

  return res.status(OK).json({
    status: 'success',
    data: {
      affectedRow,
    },
  });
});
