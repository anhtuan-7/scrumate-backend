const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const validate = require('../validations');
const { signUpSchema, loginSchema } = require('../validations/authSchema');
const { OK, UNAUTHORIZED } = require('../common/statusCode');

const router = express.Router();

router
  .route('/signup')
  .post(validate(signUpSchema, UNAUTHORIZED), authController.signup);

router
  .route('/login')
  .post(validate(loginSchema, UNAUTHORIZED), authController.login);

router.route('/logout').get(authController.logout);

router.route('/verify').get(verifyToken, (req, res) => {
  const { user } = res.locals;
  user.password = undefined;
  res.status(OK).json({
    status: 'success',
    data: {
      user,
    },
  });
});

module.exports = router;
