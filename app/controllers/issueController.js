const { Issue, Sprint, User } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const { OK, CREATED, NOT_FOUND, NO_CONTENT } = require('../common/statusCode');
const { SPRINT_NOT_FOUND, ISSUE_NOT_FOUND } = require('../common/customCode');

exports.getBacklog = catchAsync(async (req, res, next) => {
  const { projectId, sprintId } = req.params;
  const issues = await Issue.findAll({
    where: {
      projectId,
      sprintId: sprintId || null, // Sprint Backlog || Product Backlog
    },
    include: [
      {
        model: User,
        as: 'assignee',
        attributes: ['id', 'name', 'email', 'avatar'],
      },
      {
        model: User,
        as: 'reporter',
        attributes: ['id', 'name', 'email', 'avatar'],
      },
    ],
    order: [['createdAt', 'asc']],
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

exports.getIssue = catchAsync(async (req, res, next) => {
  const { issueId, projectId, sprintId } = req.params;

  const issue = await Issue.findOne({
    where: {
      id: issueId,
      projectId,
      sprintId: sprintId || null,
    },
    include: [
      {
        model: User,
        as: 'assignee',
        attributes: ['id', 'name', 'email', 'avatar'],
      },
      {
        model: User,
        as: 'reporter',
        attributes: ['id', 'name', 'email', 'avatar'],
      },
    ],
  });

  if (!issue)
    return next(new AppError(NOT_FOUND, 'Issue not found', ISSUE_NOT_FOUND));

  return res.status(OK).json({
    status: 'success',
    data: {
      issue,
    },
  });
});

exports.updateIssue = catchAsync(async (req, res, next) => {
  const { issueId, projectId } = req.params;
  const { data } = res.locals;

  console.log(data);

  const [affectedCount] = await Issue.update(data, {
    where: {
      id: issueId,
      projectId,
    },
  });

  return res.status(OK).json({
    status: 'success',
    data: {
      affectedCount,
    },
  });
});

exports.deleteIssue = catchAsync(async (req, res, next) => {
  const { issueId, projectId } = req.params;

  await Issue.destroy({
    where: { id: issueId, projectId },
  });

  return res.status(NO_CONTENT).json({
    status: 'success',
    data: {},
  });
});
