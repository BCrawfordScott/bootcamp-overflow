const asyncHandler = (handler) => (req, res, next) => handler(req, res).catch(next);

const unhandled = (req, res, next) => {
    const err = new Error("The rdquested page could not be found");
    err.status = 404;
    next(err);
}

const logErrors = (err, reg, res, session) => {
    if(process.env.NODE_ENV === production) {
        //TODO log to db
    } else {
        console.error(err);
    }

    next(err);
}

const notFound = (err, req, res, session) => {
    if (err.status === 404) {
        res.status(404);
        res.render('page-not-found', {
            title: 'Not Found',
        });
    } else {
        next(err);
    }
};

const genericError = (err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = process.env.NODE_ENV === 'production';
    res.render('error', {
        title: 'Server Error',
        message: isProduction ? null : err.message,
        stack: isProduction ? null : err.stack,
    });
}

// Order matters!  These will be passed as middleware to app.use();
const errorHandlers = [
    unhandled,
    logErrors,
    notFound,
    genericError
];

module.exports = {
    asyncHandler,
    errorHandlers,
}

