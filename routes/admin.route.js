const { isValidObjectId } = require('mongoose');
const User = require('../models/user.model');
const { roles } = require('../helpers/constants');

const router = require('express').Router();

router.get('/users', async (req, res, next) => {
    try {
        res.render('manage-users', { users: await User.find(), currentUser: req.user });
    } catch (error) {
        next(error);
    }
});


router.get('/users/:id', async (req, res, next) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            req.flash('error', 'Invalid id');
            res.redirect('/admin/users');
            return;
        }
        res.render('profile', { person: await User.findById(req.params.id) });
    } catch (error) {
        next(error);
    }
});

router.post('/users/update-role', async (req, res, next) => {
    try {
        if (!req.body.id || !req.body.role) {
            req.flash('error', 'Invalid request');
            res.redirect('back');
            return;
        }

        if (!isValidObjectId(req.body.id)) {
            req.flash('error', 'Invalid id');
            res.redirect('back');
            return;
        }

        if (req.user.id === req.body.id) {
            req.flash('error', 'Admins cannot remove themselves from Admin, ask another admin.');
            res.redirect('back');
            return;
        }

        if (!Object.values(roles).includes(req.body.role)) {
            req.flash('error', 'Invalid role');
            res.redirect('back');
            return;
        }

        const user = await User.findByIdAndUpdate(req.body.id, { role: req.body.role }, { new: true, runValidators: true });

        req.flash('info', `updated role for ${user.email} to ${user.role}`);
        res.redirect('back');
    } catch (error) {
        next(error);
    }
});

module.exports = router;
