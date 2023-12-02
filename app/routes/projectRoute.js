const express = require('express');
const projectController = require('../controllers/projectController');
const validate = require('../validations');
const { projectCreateSchema } = require('../validations/projectSchema');
const { checkUserRoleInGroup, verifyToken } = require('../middlewares');

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

module.exports = router;
