const express = require('express');
const validate = require('../validations');
const {
  addMemberSchema,
  changeMemberRoleSchema,
} = require('../validations/groupSchema');
const { verifyToken, checkUserRoleInGroup } = require('../middlewares');
const groupUserController = require('../controllers/groupUserController');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router
  .route('/')
  .get(checkUserRoleInGroup(), groupUserController.getGroupMember)
  .post(
    validate(addMemberSchema),
    checkUserRoleInGroup('admin'),
    groupUserController.addGroupMember,
  )
  .patch(
    validate(changeMemberRoleSchema),
    checkUserRoleInGroup('admin'),
    groupUserController.changeMemberRole,
  );

module.exports = router;
