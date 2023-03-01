const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControllers.getUsers);

router.post(
  '/signup',
  [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
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
