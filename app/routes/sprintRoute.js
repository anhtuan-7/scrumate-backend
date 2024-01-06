const express = require('express');
const sprintController = require('../controllers/sprintController');
const validate = require('../validations');
const {
  sprintCreateSchema,
  startSprintSchema,
  sprintUpdateSchema,
} = require('../validations/sprintSchema');
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

router
  .route('/:sprintId')
  .patch(validate(sprintUpdateSchema), sprintController.updateSprint);

router.patch('/:sprintId/complete', sprintController.completeSprint);
router.patch(
  '/:sprintId/start',
  validate(startSprintSchema),
  sprintController.startSprint,
);

module.exports = router;
