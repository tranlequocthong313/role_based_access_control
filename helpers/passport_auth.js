const passport = require('passport');
const User = require('../models/user.model');
const LocalStrategy = require("passport-local").Strategy;

passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password"
}, async (email, password, done) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: 'Email are not registered' });

        const isCorrectPassword = await user.comparePassword(password);
        !isCorrectPassword
            ? done(null, false, { message: 'Email or password is incorrect' })
            : done(null, user);
    } catch (error) {
        done(error);
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
