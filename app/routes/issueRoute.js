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
    checkUserRoleInProject('developer', 'product-owner'),
    issueController.createIssue,
  );

// router.use(checkUserRoleInProject('developer'));

router
  .route('/:issueId')
  .get(checkUserRoleInProject(), issueController.getIssue)
  .patch(
    checkUserRoleInProject('developer', 'product-owner'),
    validate(issueUpdateSchema),
    issueController.updateIssue,
  )
  .delete(checkUserRoleInProject('product-owner'), issueController.deleteIssue);

module.exports = router;
