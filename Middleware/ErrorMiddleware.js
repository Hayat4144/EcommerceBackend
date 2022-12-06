const ErrorHandler = require('../utils/ErrorHandler');

exports.ErrorMiddleware= (err,req,res ,next)=>{
    err.statusCode = err.statusCode || 500 
    err.message = err.message  || 'Internal server'
    res.status(err.statusCode).json({error:err.message})
}

