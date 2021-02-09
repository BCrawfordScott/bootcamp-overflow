const { check, validationResult } = require('express-validator');
const db = require('../db/models');

const {
    csrfProtection,
    asyncHandler,
    requireAuth,
    requireAuthor,
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

module.exports = {
    answerCreate: [requireAuth, requireInstructor, csrfProtection, ...answerValidators, asyncHandler(answerCreate)],
}
