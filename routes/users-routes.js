const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');
const fileUpload = require('../middleware/file-upload')

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  fileUpload.single('image'),
  [
    check('name').not().isEmpty(),
    check('email').isEmail(),
    check('password')
      .isLength({ min: 8 })
      .withMessage('must be at least 8 chars long'),
  ],
  usersControllers.signUp
);

router.post(
  '/login',
  [
    check('email').not().isEmpty().isEmail(),
    check('password').isLength({ min: 8 }),
  ],
  usersControllers.login
);

module.exports = router;
