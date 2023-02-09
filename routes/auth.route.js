const { Router } = require('express');
const User = require('../models/user.model');
const createHttpError = require('http-errors');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const { ensureLoggedOut } = require('connect-ensure-login');
const { registerValidator } = require('../helpers/validators');

const router = Router();

router.get('/logout', (req, res, next) => {
    req.logout(() => res.redirect('/auth/login'));
});

router.use(ensureLoggedOut({ redirectTo: '/' }));

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    keepSessionInfo: true
}));

router.get('/register', (req, res, next) => {
    res.render('register');
});

router.post('/register', registerValidator, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errors.array().forEach(error => req.flash('error', error.msg));
            return res.render('register', { messages: req.flash(), email: req.body.email });
        }

        const userExist = await User.findOne({ email: req.body.email });
        if (userExist) return res.redirect('/auth/register');

        req.flash('success', `${await (await User.create(req.body)).email} registered successfully, you can now login`);
        res.redirect('/auth/login');
    } catch (error) {
        next(error);
    }
});

module.exports = router;

