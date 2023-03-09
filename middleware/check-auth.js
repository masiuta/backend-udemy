const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      throw new Error('Authentication failed');
    }
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch { 
    next(new HttpError('Authentication failed', 401));
  }
};
