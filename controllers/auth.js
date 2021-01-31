const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const {
    loginUser,
    logoutUser,
    csrfProtection,
    asyncHandler,
} = require('../util');

const newLogin = (req, res) => {
    res.render('new-login', {
        title: 'Login',
        csrfToken: req.csrfToken(),
    });
};

const loginValidators = [
    check('emailAddress')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Email Address'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a value for Password')

];

const userLogin = async (req, res) => {
    const {
        emailAddress,
        password,
    } = req.body;

    let errors = [];
    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const user = await db.User.findOne({ where: { emailAddress } });

        if (user !== null) {
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

            if (passwordMatch) {
                loginUser(req, res, user);
                return res.redirect('/');
            }
        }

        errors.push('Login failed for the provided email address and password');
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render('new-login', {
        title: 'Login',
        emailAddress,
        errors,
        csrfToken: req.csrfToken(),
    });  
}

const userLogout = (req, res) => {
    logoutUser(req);
    res.redirect('/user/login');
}

module.exports = {
    newLogin: [csrfProtection, newLogin],
    loginUser: [csrfProtection, ...loginValidators, asyncHandler(userLogin)],
    logoutUser: userLogout,

}