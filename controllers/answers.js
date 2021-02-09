const { check, validationResult } = require('express-validator');
const db = require('../db/models');

const {
    csrfProtection,
    asyncHandler,
    requireAuth,
    requireAnswerAuthor,
    requireInstructor,
} = require('../util');

const answerValidators = [
    check('body')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a question body')
        .custom(async (_value, { req }) => {
            const { userId } = req.session.auth;
            const { id } = req.params;
            const repeat = await db.Answers.findOne({ where: { instructorId: userId, questionId: id } })

            if (repeat) {
                throw new Error('You have already submitted an answer to this question');
            }
            return true;
        }),
];

const answerCreate = async (req, res) => {
    const { userId } = req.session.auth;
    const { id } = req.params;
    const { body } = req.body;

    const answer = db.Answers.build({
        body,
        instructorId: userId,
        questionId: id,
    });

    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
        await answer.save();
        res.redirect(`/questions/${id}`);
    } else {
        const errors = validationErrors.array().map(err => err.msg);

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
            
            res.render('questions-show', {
                title: `Question - ${id}`,
                question,
                author,
                answers,
                newAnswer: answer,
                isAuthor: author.id === userId,
                errors,
                csrfToken: req.csrfToken(),
            })
        } else {
            const err = new Error('Could not find that question');
            err.status = 404;

            throw err;
        }
    }
}

const answerUpdate = async(req, res) => {
    const { userId } = req.session.auth;
    const { body: newBody } = req.body;

    const validationErrors = validationResult(req);
    const { answer } = res.locals;
    if (answer && validationErrors.isEmpty()) {
        answer.body = newBody;

        await answer.save();

        res.redirect(`/questions/${answer.questionId}`);
    } else if (answer) {
        const errors = validationErrors.array().map(err => err.msg);

        const question = await db.Questions.findOne({
            where: { id: answer.questionId },
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

            res.render('questions-show', {
                title: `Question - ${answer.questionId}`,
                question,
                author,
                answers,
                answered: true,
                newAnswer: answer,
                isAuthor: author.id === userId,
                errors,
                csrfToken: req.csrfToken(),
            })
        } else {
            const err = new Error('Could not find that question to answer');
            err.status = 404;

            throw err;
        }
    } else {
        const err = new Error('Could not find that answer');
        err.status = 404;

        throw err;
    }
}

const answerDestroy = async(req, res) => {
    const { answer } = res.locals;

    if (answer) {
        const { questionId } = answer;
        await answer.destroy();

        res.redirect(`/questions/${questionId}`)
    } else {
        const err = new Error('Illegal operation. Unable to process');
        err.status = 403;
        throw err;
    }
}

module.exports = {
    answerCreate: [requireAuth, requireInstructor, csrfProtection, ...answerValidators, asyncHandler(answerCreate)],
    answerUpdate: [requireAuth, requireInstructor, requireAnswerAuthor, csrfProtection, ...answerValidators, asyncHandler(answerUpdate)],
    answerDestroy: [requireAuth, requireInstructor, requireAnswerAuthor, csrfProtection, asyncHandler(answerDestroy)],
}
