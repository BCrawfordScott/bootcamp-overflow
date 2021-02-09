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

module.exports = {
    requireInstructor,
}
