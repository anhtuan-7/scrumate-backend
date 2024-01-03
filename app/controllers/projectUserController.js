const { User, ProjectUser, Project, GroupUser } = require('../models');
const catchAsync = require('../errors/catchAsync');
const AppError = require('../errors/appError');
const getFilter = require('../utils/apiFilter');
const { OK, NOT_FOUND, CREATED, FORBIDDEN } = require('../common/statusCode');
const { PROJECT_NOT_FOUND, USER_NOT_FOUND } = require('../common/customCode');

exports.getProjectUserList = catchAsync(async (req, res, next) => {
  const filter = getFilter(req);
  const { projectId } = req.params;

  const { count, rows } = await User.findAndCountAll({
    include: {
      model: ProjectUser,
      as: 'project',
      attributes: ['role', 'lastAccessed', 'joinedAt'],
      where: { projectId },
    },
    attributes: ['id', 'email', 'name'],
    order: [
      [
        { model: ProjectUser, as: 'project' },
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
    results: rows.length,
    total: count,
    data: {
      members: rows,
    },
  });
});

exports.addProjectUser = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { data } = res.locals;

  const [project, user] = await Promise.all([
    Project.findByPk(projectId),
    User.findOne({ where: { email: data.email } }),
  ]);

  if (!project)
    return next(
      new AppError(NOT_FOUND, 'Project not found', PROJECT_NOT_FOUND),
    );

  if (!user)
    return next(new AppError(NOT_FOUND, 'User not found', USER_NOT_FOUND));

  const groupUser = await GroupUser.findOne({
    where: {
      userId: user.id,
      groupId: project.groupId,
    },
  });

  if (!groupUser)
    return next(
      new AppError(NOT_FOUND, 'User not found in group', USER_NOT_FOUND),
    );

  const projectUser = await ProjectUser.create({
    userId: user.id,
    projectId,
    role: data.role,
  });

  return res.status(CREATED).json({
    status: 'success',
    data: {
      member: projectUser,
    },
  });
});

exports.updateRole = catchAsync(async (req, res, next) => {
  const { userId, projectId } = req.params;
  const { user, data } = res.locals;

  if (parseInt(userId, 10) === user.id)
    return next(new AppError(FORBIDDEN, 'You can not change your own role'));

  const [affectedCount] = await ProjectUser.update(
    { ...data },
    { where: { projectId, userId } },
  );

  return res.status(OK).json({
    status: 'success',
    data: {
      affectedCount,
    },
  });
});
