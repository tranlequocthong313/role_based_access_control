const { body } = require('express-validator');

module.exports = {
    registerValidator: [
        body('email').trim().isEmail().withMessage('Must be a valid email').normalizeEmail().toLowerCase(),
        body('password').trim().isString().isLength(2).withMessage('Password length must be at least 2 characters'),
        body('password2').custom((value, { req }) => {
            if (req.body.password !== value) throw new Error('Passwords do not match');
            return true;
        })
    ]
};
