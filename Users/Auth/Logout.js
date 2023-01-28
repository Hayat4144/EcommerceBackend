const AsyncFunc = require('../../utils/AsyncFunc') 
const ErrorHandler = require('../../utils/ErrorHandler') 

exports.Logout = AsyncFunc(async(req,res,next)=>{
    if(!req.cookies.token) return next(new ErrorHandler('You are unauthorized',400)) ;
    return res.status(200).clearCookie('token', { expires: new Date(0) }).json({data:"Logout Successfull."})

})