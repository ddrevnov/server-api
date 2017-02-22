import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import APIError from '../helpers/APIError';
import User from '../models/user.model';
import co from 'co';

const config = require('../../config/env');

/**
 * Returns jwt token if valid email and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function login(req, res, next) {
  const provider = req.body.provider;
  const authErr = new APIError('Authentication error', httpStatus.UNAUTHORIZED);

  co(function* () {
    try {
      if (provider === 'local') {
        let user = yield User.findOne({email: req.body.email});

        let validPassword = user.comparePassword(req.body.password);

        if (validPassword) {
          const token = jwt.sign({
            id: user._id
          }, config.jwtSecret);
          return res.json({token});
        } else {
          return next(authErr);
        }

        return;
      }

      let user = yield User.findOne({email: req.body.email});

      if (!user) {
        let user = yield User.create({
          providers: [{
            provider: req.body.provider,
            providerId: req.body.providerId,
          }],
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
        });

        const token = jwt.sign({
          id: user._id
        }, config.jwtSecret);
        return res.json({token});

      } else {
        let providers = user.providers;
        let issetProvider = providers.some(provider =>
          provider.provider === req.body.provider);

        if (!issetProvider) {
          user.providers.push({
            provider: req.body.provider,
            providerId: req.body.providerId
          });
          let savedUser = yield user.save();
        }

        const token = jwt.sign({
          id: user._id
        }, config.jwtSecret);
        return res.json({token});
      }

    } catch (err) {
      return next(err);
    }
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
