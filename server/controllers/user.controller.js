import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';

const config = require('../../config/env');

/**
 * Load user and append to req.
 */
function load(req, res, next, id) {
  User.get(id)
    .then((user) => {
      req.user = user; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get user
 * @returns {User}
 */
function get(req, res) {
  return res.json(req.user);
}

/**
 * Create new user
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function create(req, res, next) {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  user.save()
    .then(savedUser => {
      const token = jwt.sign({
        email: savedUser.email
      }, config.jwtSecret);
      return res.json({
        token,
        email: savedUser.email
      });
    })
    .catch(e => {
      const err = new APIError('Conflict', httpStatus.CONFLICT);
      return next(err);
    });
}

/**
 * Update existing user
 * @property {string} req.body.email - The email of user.
 * @returns {User}
 */
function update(req, res, next) {
  const user = req.user;
  user.email = req.body.email;

  user.save()
    .then(savedUser => res.json(savedUser))
    .catch(e => next(e));
}

/**
 * Get user list.
 * @property {number} req.query.skip - Number of users to be skipped.
 * @property {number} req.query.limit - Limit number of users to be returned.
 * @returns {User[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  User.list({ limit, skip })
    .then(users => res.json(users))
    .catch(e => next(e));
}

/**
 * Delete user.
 * @returns {User}
 */
function remove(req, res, next) {
  const user = req.user;
  user.remove()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => next(e));
}

export default { load, get, create, update, list, remove };
