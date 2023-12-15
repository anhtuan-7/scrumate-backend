const { Issue, Sprint } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { OK, CREATED, NOT_FOUND, NO_CONTENT } = require('../common/statusCode');
const { SPRINT_NOT_FOUND } = require('../common/customCode');

exports.getBacklog = catchAsync(async (req, res, next) => {
  const { projectId, sprintId } = req.params;
  const issues = await Issue.findAll({
    where: {
      projectId,
      sprintId: sprintId || null, // Sprint Backlog || Product Backlog
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
  const { data, user } = res.locals;

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
    ...data,
    projectId,
    sprintId: sprint ? sprint.id : null,
    reporterId: user.id,
  });

  return res.status(CREATED).json({
    status: 'success',
    data: {
      issue,
    },
  });
});

exports.getIssue = catchAsync(async (req, res, next) => {});

exports.updateIssue = catchAsync(async (req, res, next) => {});

exports.deleteIssue = catchAsync(async (req, res, next) => {
  const { issueId } = req.params;

  await Issue.destroy({ where: { id: issueId } });

  return res.status(NO_CONTENT).json({
    status: 'success',
    data: {},
  });
});
