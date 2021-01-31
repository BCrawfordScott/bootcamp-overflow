const csrf = require('csurf');

const auth = require('./auth');
const errors = require('./errors');

const csrfProtection = csrf({ cookie: true });

module.exports = {
    csrfProtection,
    ...auth,
    ...errors,
};