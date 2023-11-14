const express = require('express');
const organizationController = require('../controllers/organizationController');
const verifyToken = require('../middlewares/verifyToken');
const { checkUserRoleInOrganization } = require('../middlewares/checkUserRole');
const { BAD_REQUEST } = require('../common/statusCode');
const validate = require('../validations');
const {
  organizationCreateSchema,
} = require('../validations/organizationSchema');

const router = express.Router();

router
  .route('/')
  .get(verifyToken, organizationController.getOrganizationList)
  .post(
    verifyToken,
    validate(organizationCreateSchema, BAD_REQUEST),
    organizationController.createOrganization,
  );

router
  .route('/:id')
  .get(
    verifyToken,
    checkUserRoleInOrganization(),
    organizationController.getOrganization,
  );

module.exports = router;
