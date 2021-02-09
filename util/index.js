const csrf = require('csurf');

const auth = require('./auth');
const errors = require('./errors');
const questions = require('./questions');
const answers = require('./answers');

const csrfProtection = csrf({ cookie: true });

module.exports = {
    csrfProtection,
    ...auth,
    ...errors,
    ...questions,
    ...answers,
};
