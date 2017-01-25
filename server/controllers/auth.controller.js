import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';

const config = require('../../config/env');

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {

  return User.findOne({email: req.body.email})
    .then(user => {
      let validPassword = user.comparePassword(req.body.password);
      if (validPassword) {
        const token = jwt.sign({
          email: user.email
        }, config.jwtSecret);
        return res.json({
          token,
          email: user.email
        });
      } else {
        const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
        return next(err);
      }
    })
    .catch(e => {
      const err = new APIError('Authentication error', httpStatus.UNAUTHORIZED);
      return next(err);
    });

}

/**
 * This is a protected route. Will return random number only if jwt token is provided in header.
 * @param req
 * @param res
 * @returns {*}
 */
function getRandomNumber(req, res) {
  // req.user is assigned by jwt middleware if valid token is provided
  return res.json({
    user: req.user,
    num: Math.random() * 100
  });
}

export default { login, getRandomNumber };
