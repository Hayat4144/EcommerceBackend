const ErrorHandler = require('../utils/ErrorHandler');

exports.ErrorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'Internal server'
    if (err.name === 'CastError') {
        const message = `Resource not found: ${err.path} `
        err = new ErrorHandler(message, 400)
    }
    res.status(err.statusCode).json({ error: err.message })
}

