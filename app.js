const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const store = require('connect-pg-simple');

const { sessionSecret } = require('express-session');
const { errorHandlers } = require('./util')

const app = express();

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(sessionSecret));
app.use(session({
    store: new(store(session))(),
    name: 'bootcamp-overflow.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));
app.use(express.urlencoded({ extended: false }));

// ROUTES //
// ROUTES //

// ERRORS
app.use(errorHandlers);

module.exports = app;