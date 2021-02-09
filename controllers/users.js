const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const db = require('../db/models');
const { 
    loginUser, 
    csrfProtection,
    asyncHandler,
    redirectAuth,
    requireAuth,
    requireInstructor,
} = require('../util');

const userValidators = [
    check('username')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a username')
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
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm passwords match');
            }
            return true;
        }),
];

const newUser = (req, res) => {
    const user = db.Users.build({});
    res.render('new-user', {
        title: 'Register',
        user,
        csrfToken: req.csrfToken(),
    });
}

const createUser = async (req, res) => {
    const {
        username,
        emailAddress,
        password,
    } = req.body;

    const user = db.Users.build({
        username,
        password,
        email: emailAddress,
    });

    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.hashedPassword = hashedPassword;
        await user.save();
        return loginUser(req, res, user);

    } else {
        const errors = validationErrors.array().map(err => err.msg);
        console.error(errors);
        res.render('new-user', {
            title: 'Register',
            user,
            errors,
            csrfToken: req.csrfToken(),
        });
    }
} 

const userShow = async (req, res) => {
    const { id } = req.params;
    console.log('In the user show')
    const showUser = await db.Users.findOne({
        where: {
            id
        },
        include: [
            {
                model: db.Questions,
                as: 'questions',
                include: {
                    model: db.Answers,
                    as: 'answers',
                }
            },
            {
                model: db.Answers,
                as: 'answers',
                include: {
                    model: db.Questions,
                    as: 'question',
                },
            }
        ]
    });

    if (showUser) { 
        const { questions, answers } = showUser;
        
        res.render('user-show', {
            title: `User - ${id}`,
            showUser,
            questions,
            answers,
        });
    } else {
        const err = new Error('No such user');
        err.status = 404;
        throw err;
    }
}

module.exports = {
    createUser: [redirectAuth, csrfProtection, ...userValidators, asyncHandler(createUser)],
    newUser: [redirectAuth, csrfProtection, newUser],
    userShow: [requireAuth, asyncHandler(userShow)],
};
