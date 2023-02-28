const uuid = require('uuid').v4;
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');

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

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     return next(new HttpError('Invalid inputs passed, please check your data', 422));
    }
  

  const { name, email, password, places } = req.body;
  let existingUser
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://miro.medium.com/v2/resize:fit:1400/0*CF_7x63JCB0928U9',
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing Up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ createdUser });
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
