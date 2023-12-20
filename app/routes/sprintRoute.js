const express = require('express');
const sprintController = require('../controllers/sprintController');
const validate = require('../validations');
const { sprintCreateSchema } = require('../validations/sprintSchema');
const { checkUserRoleInProject, verifyToken } = require('../middlewares');

const issueRoute = require('./issueRoute');

const router = express.Router({ mergeParams: true });

router.use('/:sprintId/issues', issueRoute);

router.use(verifyToken);

router
  .route('/')
  .get(sprintController.getSprintList)
  .post(
    checkUserRoleInProject(),
    validate(sprintCreateSchema),
    sprintController.createSprint,
  );

module.exports = router;
