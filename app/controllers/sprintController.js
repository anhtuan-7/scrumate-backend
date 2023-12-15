const { Sprint } = require('../models');
const catchAsync = require('../errors/catchAsync');
const { OK, CREATED } = require('../common/statusCode');

exports.getSprintList = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const sprints = await Sprint.findAll({
    where: { projectId },
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
