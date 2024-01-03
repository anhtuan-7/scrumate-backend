const express = require('express');
const projectUserController = require('../controllers/projectUserController');
const validate = require('../validations');
const {
  addMemberSchema,
  updateRoleSchema,
} = require('../validations/projectSchema');

const { verifyToken } = require('../middlewares');

const router = express.Router({ mergeParams: true });

router.use(verifyToken);

router
  .route('/')
  .get(projectUserController.getProjectUserList)
  .post(validate(addMemberSchema), projectUserController.addProjectUser);

router
  .route('/:userId')
  .patch(validate(updateRoleSchema), projectUserController.updateRole);

module.exports = router;
