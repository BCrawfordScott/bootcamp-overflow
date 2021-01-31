const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { 
    loginUser, 
    csrfProtection,
    asyncHandler,
} = require('../util');

const userValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for First Name')
        .isLength({ max: 100 })
        .withMessage('Username must not be more than 100 characters long'),
    check('emailAddress')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Email Address')
        .isLength({ max: 100 })
        .withMessage('Email Address must not be more than 100 characters long')
        .isEmail()
        .withMessage('Email Address is not a valid email'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Password')
        .isLength({ min: 8, max: 50 })
        .withMessage('Password must be between 8 and 50 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
        .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
    check('confirmPassword')
        .exists({ checkFalsy: true })
        .withMessage('Please confirm your password')
        .isLength({ min: 8, max: 50 })
        .withMessage('Confirmed password must be between 8 and 50 characters long')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password does not match Password');
            }
            return true;
        }),
];

const newUser = (req, res) => {
    const user = db.User.build({});
    res.render('new-user', {
        title: 'Register',
        user,
        csrf: req.csrfToken(),
    });
}

const createUser = async (req, res) => {
    const {
        username,
        emailAddress,
        password,
    } = req.body;

    const user = db.User.build({
        username,
        emailAddress,
        password,
    });

    const validationErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();
        loginUser(req, user);
        res.redirect('/');
    } else {
        const errors = validationErrors.array().map(err => err.msg);
        res.render('user-registration', {
            title: 'Register',
            user,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
} 

module.exports = {
    createUser: [csrfProtection, ...userValidators, asyncHandler(createUser)],
    newUser: [csrfProtection, newUser]
};