const db = require("../db/models");

const requireInstructor = (req, res, next) => {
    const { user } = res.locals;

    if(user.isInstructor()) {
        next();
    } else {
        const err = new Error('Illegal operation.');
        err.status = 403;
        next(err);
    }
}

const requireAnswerAuthor = async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.session.auth;

    const answer = await db.Answers.findOne({ where: { id, instructorId: userId } });
    if (answer) {
        res.locals.answer = answer;
        next();
    } else {
        const err = new Error('Illegal operation.');
        err.status = 403;
        next(err);
    }
}

module.exports = {
    requireInstructor,
    requireAnswerAuthor,
}
