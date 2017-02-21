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
  const type = req.body.type;
  let condition = null;
  const authErr = new APIError('Authentication error', httpStatus.UNAUTHORIZED);

  switch (type) {
    case 'local':
      condition = {'local.email': req.body.email};
      break;
    case 'google':
      condition = {'google.id': req.body.id};
      break;
  }

  if (!condition) return next(authErr);

  if (type === 'local') {
    User.findOne(condition)
      .then(user => {
        let validPassword = user.comparePassword(req.body.password);
        if (validPassword) {
          const token = jwt.sign({
            id: user._id
          }, config.jwtSecret);
          return res.json({
            token,
            email: user.local.email
          });
        } else {
          return next(authErr);
        }
      })
      .catch(e => {
        return next(authErr);
      });
  } else {
    User.findOne(condition)
      .then(user => {
        if (!user) {
          User.create({
            [type]: {
              id: req.body.id,
              name: req.body.name,
              email: req.body.email,
            }
          })
            .then(user => {
              const token = jwt.sign({
                id: user._id
              }, config.jwtSecret);
              return res.json({
                token,
                id: user[type].id
              });
            })
            .catch(err => {
              return next(authErr);
            });
        } else {
          const token = jwt.sign({
            id: user._id
          }, config.jwtSecret);
          return res.json({
            token,
            id: user[type].id
          });
        }
      });
  }

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
