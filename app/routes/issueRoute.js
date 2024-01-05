const express = require('express');
const issueController = require('../controllers/issueController');
const validate = require('../validations');
const {
  issueCreateSchema,
  issueUpdateSchema,
} = require('../validations/issueSchema');
const { checkUserRoleInProject, verifyToken } = require('../middlewares');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router
  .route('/')
  .get(issueController.getBacklog)
  .post(
    checkUserRoleInProject(),
    validate(issueCreateSchema),
    issueController.createIssue,
  );

// router.use(checkUserRoleInProject('developer'));

router
  .route('/:issueId')
  .get(issueController.getIssue)
  .patch(validate(issueUpdateSchema), issueController.updateIssue)
  .delete(issueController.deleteIssue);

module.exports = router;
