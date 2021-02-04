const { check, validationResult } = require('express-validator');
const { sequelize } = require('../db/models');

const db = require('../db/models');
const {
    csrfProtection,
    asyncHandler,
    requireAuth,
    requireAuthor,
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

const questionValidators = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a title')
        .isLength({ max: 280 })
        .withMessage('Title cannot exceed 280 characters')
        .custom(async (value, { req }) => {
            const { userId } = req.session.auth;
            const repeat = await db.Questions.findOne({ where: { userId, title: value}})

            if (repeat && repeat.id != req.params.id) {
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
        console.log(errors);
        res.render('questions-new', {
            title: 'New Question',
            errors,
            question,
            csrfToken: req.csrfToken(),
        })
    }
}

const questionShow = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.session.auth;

    const question = await db.Questions.findOne({ where: { id }, include: 'author'});
    
    if (question) {
        const { author } = question;

        res.render('questions-show', {
            title: `Question - ${id}`,
            question,
            author,
            isAuthor: author.id === userId,
        })
    } else {
        const err = new Error('Could not find that question');
        err.status = 404;

        throw err;
    }
}

// requireAuthor will provide the question via res.locals
const questionEdit = async (req, res) => {
    const { id } = req.params;
    const { question } = res.locals;

    if (question) {
        res.render('questions-edit', {
            title: `Edit Question - ${id}`,
            question,
            csrfToken: req.csrfToken(),
        })
    } else {
        res.redirect('/questions');
    }
}

// requireAuthor will provide the question via res.locals
const questionUpdate = async (req, res) => {
    const { id } = req.params;
    const {
        title: newTitle,
        body: newBody
    } = req.body;

    const validationErrors = validationResult(req);
    const { question } = res.locals
    if(question && validationErrors.isEmpty()) {
        question.title = newTitle;
        question.body = newBody;

        await question.save();

        res.redirect(`/questions/${id}`);
    } else if (question) {
        const errors = validationErrors.array().map(err => err.msg);

        res.render(`questions-edit`, {
            title: `Edit Question - ${id}`,
            question,
            errors,
            csrfToken: req.csrfToken(), 
        })
    } else {
        const err = new Error('Could not find that question');
        err.status = 404;

        throw err;
    }


}

module.exports = {
    questionIndex: [asyncHandler(questionIndex)],
    questionNew: [requireAuth, csrfProtection, questionNew],
    questionCreate: [requireAuth, csrfProtection, ...questionValidators, asyncHandler(questionCreate)],
    questionShow: [requireAuth, asyncHandler(questionShow)],
    questionEdit: [requireAuth, requireAuthor, csrfProtection, asyncHandler(questionEdit)],
    questionUpdate: [requireAuth, requireAuthor, csrfProtection, ...questionValidators, asyncHandler(questionUpdate)]
}
