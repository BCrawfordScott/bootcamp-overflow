const { check, validationResult } = require('express-validator');
const { sequelize } = require('../db/models');

const db = require('../db/models');
const {
    csrfProtection,
    asyncHandler,
    requireAuth,
} = require('../util');

const questionIndex = async (_req, res) => {
    const questions = await db.Questions.findAll({ order: [['createdAt', 'DESC']], limit: 25 });
    res.render('questions-index', {
        title: 'Questions',
        questions,
    }); 
};

const questionNew = (req, res) => {
    const question = db.Questions.build({});

    res.render('questions-new', {
        title: 'New Question',
        question,
        csrfToken: req.csrfToken(),
    })
};

const quetionValidators = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a title')
        .isLength({ max: 280 })
        .withMessage('Title cannot exceed 280 characters')
        .custom(async (value, { req }) => {
            const { userId } = req.session.auth;
            const repeats = await db.Questions.findAll({ where: { userId, title: value}})
            if (!repeats.isEmpty()) {
                throw new Error('You have already submitted a question with this title');
            }
            return true;
        }),
    check('body')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a question body')
        
];

const questionCreate = async (req, res) => {
    const { userId } = req.session.auth;

    const {
        title, 
        body,
    } = req.body;

    const question = db.Questions.build({
        title, 
        body,
        userId,
    });

    const validationErrors = validationResult(req);

    if(validationErrors.isEmpty()) {
        await question.save();
        res.redirect('/questions');
    } else {
        const errors = validationErrors.array().map(err => err.msg);

        res.render('questions-new', {
            title: 'New Question',
            errors,
            question
        })
    }
}

module.exports = {
    questionIndex: [requireAuth, asyncHandler(questionIndex)],
    questionNew: [requireAuth, csrfProtection, questionNew],
    questionCreate: [requireAuth, csrfProtection, asyncHandler(questionCreate)],
}