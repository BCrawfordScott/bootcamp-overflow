const db = require('../db/models');

const loginUser = (req, res, user) => {
    req.session.auth = {
        userId: user.id,
    }

    req.session.save(() => res.redirect('/'));
};

const logoutUser = (req, res) => {
    delete req.session.auth;

    req.session.save(() => res.redirect('/'));
};

const requireAuth = (req, res, next) => {
    if(!req.locals.authenticated) {
        return res.redirect('users/login');
    }

    return next();
};

const redirectAuth = (req, res, next) => {
    if(res.locals.authenticated) {
        return res.redirect('/')
    }

    return next();
}

const restoreUser = async (req, res, next) => {

    if (req.session.auth) {
        const { userId } = req.session.auth;

        try {
            const user = await db.Users.findByPk(userId);

            if (user) {
                res.locals.authenticated = true;
                res.locals.user = user;
 
                return next();
            }

            next();
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
    restoreUser,
    redirectAuth,
}
