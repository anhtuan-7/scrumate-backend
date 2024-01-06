const { Op } = require('sequelize');
const { Sprint, Issue } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { OK, CREATED, BAD_REQUEST } = require('../common/statusCode');

exports.getSprintList = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const sprints = await Sprint.findAll({
    where: { projectId },
    order: ['createdAt'],
  });

  return res.status(OK).json({
    status: 'success',
    data: {
      sprints,
    },
  });
});

exports.createSprint = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { user, data } = res.locals;

  const sprint = await Sprint.create({
    ...data,
    projectId,
    creatorId: user.id,
  });

  return res.status(CREATED).json({
    status: 'success',
    data: {
      sprint,
    },
  });
});

exports.updateSprint = catchAsync(async (req, res, next) => {});

exports.startSprint = catchAsync(async (req, res, next) => {
  const { projectId, sprintId } = req.params;
  const { data } = res.locals;

  const activeSprint = await Sprint.findOne({
    where: {
      projectId,
      active: true,
    },
  });

  if (activeSprint)
    return next(
      new AppError(
        BAD_REQUEST,
        'A project cannot have more than one active sprint.',
      ),
    );

  const [affectedCount] = await Sprint.update(
    { ...data, active: true },
    {
      where: {
        id: sprintId,
        projectId,
      },
    },
  );

  return res.status(OK).json({
    status: 'success',
    data: {
      affectedCount,
    },
  });
});

exports.completeSprint = catchAsync(async (req, res, next) => {
  const { sprintId } = req.params;

  const sprint = await Sprint.findByPk(sprintId);

  if (sprint.active) sprint.active = false;
  else
    return next(new AppError(BAD_REQUEST, 'This sprint is currently inactive'));

  const result = await Promise.all([
    sprint.save(),
    Issue.update(
      { sprintId: null, status: 'to-do' },
      {
        where: {
          sprintId,
          status: {
            [Op.ne]: 'done',
          },
        },
      },
    ),
  ]);

  return res.status(OK).json({
    status: 'success',
    data: {
      result,
    },
  });
});
