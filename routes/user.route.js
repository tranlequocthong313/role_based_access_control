const { Router } = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');

const router = Router();

router.use(ensureLoggedIn({ redirectTo: '/auth/login' }));

router.get('/profile', (req, res, next) => {
    res.render('profile', { person: req.user });
});

module.exports = router;

