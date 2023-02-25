const uuid = require('uuid').v4;
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Vasya Pupkin',
    email: 'vasyapupkin@test.com',
    password: 'testtest',
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    if (!errors.msg.isEmpty()) {
      throw new HttpError('Invalid inputs passed, please check your data', 422);
    }
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists', 422);
  }

  const createdUser = {
    id: uuid,
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError(
      'Could not identify user, credential seem to be wrong',
      401
    );
  }
  res.json({ message: 'Logged In' });
};

exports.signUp = signUp;
exports.getUsers = getUsers;
exports.login = login;
