const express = require('express');
const issueController = require('../controllers/issueController');
const validate = require('../validations');
const { issueCreateSchema } = require('../validations/issueSchema');
const { checkUserRoleInProject, verifyToken } = require('../middlewares');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router
  .route('/')
  .get(issueController.getBacklog)
  .post(
    checkUserRoleInProject('product-owner', 'scrum-master'),
    validate(issueCreateSchema),
    issueController.createIssue,
  );

module.exports = router;
