const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const store = require('connect-pg-simple');

const { sessionSecret } = require('./config');
const { errorHandlers, restoreUser } = require('./util')
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');

const app = express();

// CONFIG //
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(sessionSecret));
app.use(session({
    store: new(store(session))(
        {
            /*
            connection string is built by following the syntax:
            postgres://USERNAME:PASSWORD@HOST_NAME:PORT/DB_NAME
            */
            conString: `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_DATABASE}`
        }
    ),
    name: 'bootcamp-overflow.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(restoreUser);
// CONFIG //

// ROUTES //
app.get('/', (_req, res) => {console.log('trying'); return res.render('landing', {title: 'Welcome'}) });

app.use('/', authRouter);
app.use('/users', userRouter);
// ROUTES //

// ERRORS
app.use(errorHandlers);

module.exports = app;
