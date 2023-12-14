const express = require('express');
const groupController = require('../controllers/groupController');
const validate = require('../validations');
const { groupCreateSchema } = require('../validations/groupSchema');
const { checkUserRoleInGroup, verifyToken } = require('../middlewares');

const groupUserRoute = require('./groupUserRoute');
const projectRoute = require('./projectRoute');

const router = express.Router();

router.use('/:groupId/members', groupUserRoute);
router.use('/:groupId/projects', projectRoute);

router.use(verifyToken);

router
  .route('/')
  .get(groupController.getGroupList)
  .post(validate(groupCreateSchema), groupController.createGroup);

router.route('/:groupId').get(checkUserRoleInGroup(), groupController.getGroup);

module.exports = router;
