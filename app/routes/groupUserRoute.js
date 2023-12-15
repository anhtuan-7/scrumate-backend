const express = require('express');
const groupUserController = require('../controllers/groupUserController');
const { verifyToken, checkUserRoleInGroup } = require('../middlewares');
const validate = require('../validations');
const {
  addMemberSchema,
  changeMemberRoleSchema,
} = require('../validations/groupSchema');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router
  .route('/')
  .get(checkUserRoleInGroup(), groupUserController.getGroupMember)
  .post(
    validate(addMemberSchema),
    checkUserRoleInGroup('group-admin'),
    groupUserController.addGroupMember,
  );

router
  .route('/:memberId')
  .get(checkUserRoleInGroup('group-admin'), groupUserController.getMemberDetail)
  .patch(
    validate(changeMemberRoleSchema),
    checkUserRoleInGroup('group-admin'),
    groupUserController.changeMemberRole,
  );

module.exports = router;
