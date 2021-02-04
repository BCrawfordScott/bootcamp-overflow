const db = require("../db/models");

const { Questions } = require('../db/models');

const requireAuthor = async(req, res, next) => {
    const { id } = req.params;
    const { userId } = req.session.auth;

    const question = await db.Questions.findOne({ where: { id, userId }});
    if (question) {
        res.locals.question = question;
        next();
    } else {
        res.redirect('/questions');
    }
}

module.exports = {
    requireAuthor,
}
