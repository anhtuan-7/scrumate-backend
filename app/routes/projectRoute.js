const express = require('express');
const projectController = require('../controllers/projectController');
const validate = require('../validations');
const { projectCreateSchema } = require('../validations/projectSchema');
const {
  checkUserRoleInGroup,
  checkUserRoleInProject,
  verifyToken,
} = require('../middlewares');

const issueRoute = require('./issueRoute');
const sprintRoute = require('./sprintRoute');
const projectUserRoute = require('./projectUserRoute');

const router = express.Router({ mergeParams: true });

router.use('/:projectId/issues', issueRoute);
router.use('/:projectId/sprints', sprintRoute);
router.use('/:projectId/users', projectUserRoute);

router.use(verifyToken);

router
  .route('/')
  .get(projectController.getProjectList)
  .post(
    validate(projectCreateSchema),
    checkUserRoleInGroup('group-admin', 'project-admin'),
    projectController.createProject,
  );

router
  .route('/:projectId')
  .get(checkUserRoleInProject(), projectController.getProject)
  .patch(projectController.updateProject);

module.exports = router;
