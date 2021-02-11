const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const store = require('connect-pg-simple');

const { sessionSecret } = require('./config');
const { errorHandlers, restoreUser } = require('./util')
const landingRouter = require('./routes/landing');
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const questionRouter = require('./routes/question');
const answerRouter = require('./routes/answer');
const instructorRouter = require('./routes/instructor');
const apiRouter = require('./routes/api');

const app = express();

// Define the connection string for connect-pg-simple - the "store"
let dbURL;

if (process.env.NODE_ENV === 'production') {
    dbURL = process.env.DATABASE_URL;
} else {
        /*
            connection string is built by following the syntax:
            postgres://USERNAME:PASSWORD@HOST_NAME:PORT/DB_NAME
        */
    dbURL = `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_DATABASE}`;
}
const corsApproved = [
    // 'https://bcamp-overflow.herokuapp.com',
    // 'localhost:8080',
];

// CONFIG //
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser(sessionSecret));
app.use(session({
    store: new(store(session))(
        {  
            conString: dbURL,
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
app.get('/', landingRouter);

app.use('/', authRouter);
app.use('/users', userRouter);
app.use('/questions', questionRouter);
app.use('/answers', answerRouter);
app.use('/instructor', instructorRouter);

app.use('/api', apiRouter);
// ROUTES //

// ERRORS
app.use(errorHandlers);

module.exports = app;
