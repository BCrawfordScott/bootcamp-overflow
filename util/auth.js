const db = require('../db/models');

const loginUser = (req, user) => {
    req.session.auth = {
        userId: user.id,
    }
};

const logoutUser = (req) => {
    delete req.session.auth;
};

const requireAuth = (req, res, next) => {
    if(!req.locals.authenticated) {
        return res.redirect('/');
    }

    return next();
};

const restoreUser = async (req, res, next) => {
    console.log(req.session);

    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await db.User.findByPk(userId);

            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
                next();
            }
        } catch (err) {
            res.locals.authenticated = false;
            next();
        }
    } else {
        res.locals.authenticated = false;
        next();
    }
};

module.exports = {
    loginUser,
    logoutUser,
    requireAuth,
    restoreUser
}