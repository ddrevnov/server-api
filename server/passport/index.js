import passportGoogleOauth from 'passport-google-oauth';
import User from '../models/user.model';
const GoogleStrategy = passportGoogleOauth.OAuth2Strategy;

export default function (passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new GoogleStrategy({
      clientID: '494200020444-oeu9e4t6pvv9chde074gt42fbq9prnij.apps.googleusercontent.com',
      clientSecret: '-a85bcfG6wS9-VhOO11LeiuN',
      callbackURL: "http://localhost:8080/auth/google/callback"
    },
    function(token, refreshToken, profile, done) {
      User.findOne({ 'google.id' : profile.id })
        .then(user => {
          if (user) {
            return done(null, user);
          } else {
            let newUser = new User();

            newUser.google.id    = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value;

            newUser.save(function(err) {
              if (err)
                throw err;
              return done(null, newUser);
            });
          }
        })
        .catch(err => done(err))
    }
  ));
}
