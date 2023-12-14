const { OK, CREATED, NOT_FOUND } = require('../common/statusCode');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { Issue, Sprint } = require('../models');
const { SPRINT_NOT_FOUND } = require('../common/customCode');

exports.getBacklog = catchAsync(async (req, res, next) => {
  const issues = await Issue.findAll({
    where: {
      projectId: req.params.projectId,
      sprintId: req.params.sprintId || null, // Sprint Backlog || Product Backlog
    },
  });
  return res.status(OK).json({
    status: 'success',
    results: issues.length,
    data: {
      issues,
    },
  });
});

exports.createIssue = catchAsync(async (req, res, next) => {
  // The existence of the "Project" is guaranteed due to the validation performed by the role check middleware.
  const { sprintId, projectId } = req.params;
  let sprint = null;
  if (sprintId) {
    sprint = await Sprint.findByPk(sprintId, { where: { projectId } });
    if (!sprint) {
      return next(
        new AppError(NOT_FOUND, 'Sprint not found', SPRINT_NOT_FOUND),
      );
    }
  }

  const issue = await Issue.create({
    ...res.locals.data,
    projectId,
    sprintId: sprint ? sprint.id : null,
    reporterId: res.locals.user.id,
  });

  return res.status(CREATED).json({
    status: 'success',
    data: {
      issue,
    },
  });
});
