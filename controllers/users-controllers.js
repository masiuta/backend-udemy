const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password').exec();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later',
      500
    );
    return next(error);
  }

  res.json({ users });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data', 422)
    );
  }

  const { name, email, password } = req.body;
  let existingUser;
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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError('Could not create user, please try again', 500));
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing Up failed, please try again.', 500);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.PRIVATE_KEY,
      { expiresIn: process.env.TOKEN_EXPIRE }
    );
  } catch (err) {
    return next(new HttpError('Signing Up failed, please try again.', 500));
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Login failed, please try again later', 500);
    return next(error);
  }

  if (!existingUser) {
    return next(
      new HttpError(
        'Could not identify user, credentials seem to be wrong',
        401
      )
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return new HttpError(
      'Could not identify user, credential seem to be wrong',
      500
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError(
        'Could not identify user, credentials seem to be wrong',
        401
      )
    );
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.PRIVATE_KEY,
      { expiresIn: process.env.TOKEN_EXPIRE }
    );
  } catch (err) {
    return next(new HttpError('Login failed, please try again later', 500));
  }

  res.json({ userId: createdUser.id, email: createdUser.email, token: token });
};

exports.signUp = signUp;
exports.getUsers = getUsers;
exports.login = login;
