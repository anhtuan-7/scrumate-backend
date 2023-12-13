const express = require('express');
const projectController = require('../controllers/projectController');
const issueController = require('../controllers/issueController');
const validate = require('../validations');
const { projectCreateSchema } = require('../validations/projectSchema');
const {
  checkUserRoleInGroup,
  checkUserRoleInProject,
  verifyToken,
} = require('../middlewares');

const router = express.Router({ mergeParams: true });

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

router
  .route('/:projectId/issues')
  .get(issueController.getBacklog)
  .post(issueController.createIssue);

module.exports = router;
