const express = require('express');
const groupController = require('../controllers/groupController');
const validate = require('../validations');
const { groupCreateSchema } = require('../validations/groupSchema');
const { checkUserRoleInGroup, verifyToken } = require('../middlewares');
const { BAD_REQUEST } = require('../common/statusCode');
const groupUserRoute = require('./groupUserRoute');

const router = express.Router();

router.use('/:groupId/members', groupUserRoute);

router.use(verifyToken);

router
  .route('/')
  .get(groupController.getGroupList)
  .post(validate(groupCreateSchema, BAD_REQUEST), groupController.createGroup);

router.route('/:groupId').get(checkUserRoleInGroup(), groupController.getGroup);

module.exports = router;
