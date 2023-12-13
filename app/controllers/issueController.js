const { OK, CREATED } = require('../common/statusCode');
const catchAsync = require('../errors/catchAsync');
const { Issue } = require('../models');

exports.getBacklog = catchAsync(async (req, res, next) => {
  const { count, rows } = await Issue.findAndCountAll({
    where: {
      projectId: req.params.projectId,
      sprintId: req.params.sprintId || null, // Sprint Backlog || Product Backlog
    },
  });
  return res.status(OK).json({
    status: 'success',
    results: rows.length,
    total: count,
    data: {
      issues: rows,
    },
  });
});

exports.createIssue = catchAsync((req, res, next) => {
  const issue = Issue.create({
    ...res.locals.data,
    projectId: req.params.projectId,
    sprintId: req.params.sprintId || null,
  });

  return res.status(CREATED).json({
    status: 'success',
    data: { issue },
  });
});
