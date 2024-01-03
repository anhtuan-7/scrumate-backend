const express = require('express');
const groupUserController = require('../controllers/groupUserController');
const { verifyToken, checkUserRoleInGroup } = require('../middlewares');
const validate = require('../validations');
const {
  addMemberSchema,
  updateRoleSchema,
} = require('../validations/groupSchema');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router
  .route('/')
  .get(checkUserRoleInGroup(), groupUserController.getGroupUserList)
  .post(
    validate(addMemberSchema),
    checkUserRoleInGroup('group-admin'),
    groupUserController.addGroupUser,
  );

router
  .route('/:userId')
  .get(checkUserRoleInGroup('group-admin'), groupUserController.getGroupUser)
  .patch(
    validate(updateRoleSchema),
    checkUserRoleInGroup('group-admin'),
    groupUserController.updateRole,
  );

module.exports = router;
