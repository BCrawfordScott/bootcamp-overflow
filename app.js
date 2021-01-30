const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const { sessionSecret } = require('express-session');

const app = express();

app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(sessionSecret));
app.use(session({
    name: 'reading-list.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
}));
app.use(express.urlencoded({ extended: false }));

module.exports = app;