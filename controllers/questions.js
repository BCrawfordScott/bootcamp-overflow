const { check, validationResult } = require('express-validator');
const db = require('../db/models');

const {
    csrfProtection,
    asyncHandler,
    requireAuth,
    requireAuthor,
    checkQuestionPermissions,
} = require('../util');

const questionIndex = async (_req, res) => {
    const questions = await db.Questions.findAll({ 
        order: [['createdAt', 'DESC']], 
        limit: 25,
        include: 'answers'
     });
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
        res.redirect(`/questions/${question.id}`);
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

    const question = await db.Questions.findOne({ 
        where: { id }, 
        include: [ 
            {
                model: db.Users,
                as: 'author'
            }, 
            {
                model: db.Answers,
                as: 'answers',
                include: {
                    model: db.Users,
                    as: 'instructor',
                }
            }
        ],
    });
    
    if (question) {
        const { author, answers } = question;
        const answered = await db.Answers.findOne({ where: { instructorId: userId, questionId: id }});
        
        res.render('questions-show', {
            title: `Question - ${id}`,
            question,
            author,
            answers,
            answered,
            newAnswer: db.Answers.build(),
            isAuthor: author.id === userId,
            csrfToken: req.csrfToken(),
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
    const { userId } = req.session.auth;
    const {
        title: newTitle,
        body: newBody
    } = req.body;

    const validationErrors = validationResult(req);
    const { question } = res.locals
    if(question && validationErrors.isEmpty()) {
        checkQuestionPermissions(id, userId);
        
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

const questionDestroy = async (req, res) => {
    const { question } = res.locals;
    const { userId } = req.session.auth;

    if(question) {
        checkQuestionPermissions(question.userId, userId);
        const { title: qTitle } = question;
        
        await question.destroy();

        res.render('question-delete', {
            title: 'Question Deleted',
            qTitle,
        })
    } else {
        const err = new Error('Illegal operation. Unable to process');
        err.status = 403;
        throw err;
    }
}

module.exports = {
    questionIndex: [asyncHandler(questionIndex)],
    questionNew: [requireAuth, csrfProtection, questionNew],
    questionCreate: [requireAuth, csrfProtection, ...questionValidators, asyncHandler(questionCreate)],
    questionShow: [requireAuth, csrfProtection, asyncHandler(questionShow)],
    questionEdit: [requireAuth, requireAuthor, csrfProtection, asyncHandler(questionEdit)],
    questionUpdate: [requireAuth, requireAuthor, csrfProtection, ...questionValidators, asyncHandler(questionUpdate)],
    questionDestroy: [requireAuth, requireAuthor, csrfProtection, asyncHandler(questionDestroy)],
}
