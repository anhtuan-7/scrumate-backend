const express = require('express');
const groupController = require('../controllers/groupController');
const verifyToken = require('../middlewares/verifyToken');
const { checkUserRoleInGroup } = require('../middlewares/checkUserRole');
const { BAD_REQUEST } = require('../common/statusCode');
const validate = require('../validations');
const { groupCreateSchema } = require('../validations/groupSchema');

const router = express.Router();

router
  .route('/')
  .get(verifyToken, groupController.getGroupList)
  .post(
    verifyToken,
    validate(groupCreateSchema, BAD_REQUEST),
    groupController.createGroup,
  );

router
  .route('/:id')
  .get(verifyToken, checkUserRoleInGroup(), groupController.getGroup);

module.exports = router;
