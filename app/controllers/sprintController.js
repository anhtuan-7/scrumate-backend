const { OK, CREATED } = require('../common/statusCode');
const catchAsync = require('../errors/catchAsync');
const { Sprint } = require('../models');

exports.getSprintList = catchAsync(async (req, res, next) => {
  const sprints = await Sprint.findAll({
    where: { projectId: req.params.projectId },
  });
  return res.status(OK).json({
    status: 'success',
    data: {
      sprints,
    },
  });
});

exports.createSprint = catchAsync(async (req, res, next) => {
  const sprint = await Sprint.create({
    ...res.locals.data,
    projectId: req.params.projectId,
    creatorId: req.locals.user.id,
  });

  return res.status(CREATED).json({
    status: 'success',
    data: {
      sprint,
    },
  });
});
