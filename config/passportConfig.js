const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');

var User = mongoose.model('User');


passport.use(
  new localStrategy({ usernameField: 'fullName' },
    (username, password, done) => {
      User.findOne({ fullName: username },
        (err, User) => {
          if (err)
            return done(err);
          // unknown user
          else if (!User)
            return done(null, false, { message: 'User is not registered' });
          // wrong password
          else if (!User.verifyPassword(password))
            return done(null, false, { message: 'Wrong password.' });
          // authentication succeeded
          else
            return done(null, User);
        });
    })
);
