const { ensureLoggedIn } = require('connect-ensure-login');
const { Router } = require('express');
const createHttpError = require('http-errors');
const { roles } = require('../helpers/constants');

const router = Router();

const ensureRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) return next(createHttpError.NotFound());
        next();
    };
};

router.get('/', (req, res, next) => res.render('index'));
router.use('/admin', ensureLoggedIn({ redirectTo: '/auth/login' }),
    ensureRoles([roles.admin]), require('./admin.route'));
router.use('/user', require('./user.route'));
router.use('/auth', require('./auth.route'));


module.exports = router;
