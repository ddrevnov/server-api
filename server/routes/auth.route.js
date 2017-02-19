import express from 'express';
import validate from 'express-validation';
import expressJwt from 'express-jwt';
import paramValidation from '../../config/param-validation';
import authCtrl from '../controllers/auth.controller';
import config from '../../config/env';
import passport from 'passport';

const router = express.Router(); // eslint-disable-line new-cap

/** POST /api/auth/login - Returns token if correct email and password is provided */
router.route('/login')
  .post(validate(paramValidation.login), authCtrl.login);

router.route('/auth/google')
  .get(passport.authenticate('google', { scope : ['profile', 'email'] }));

router.route('/auth/google/callback')
  .get(
    passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'})
  );

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */
router.route('/random-number')
  .get(expressJwt({ secret: config.jwtSecret }), authCtrl.getRandomNumber);

export default router;

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/');
}
