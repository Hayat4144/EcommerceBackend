const AsyncFunc = require('../../utils/AsyncFunc') 
const ErrorHandler = require('../../utils/ErrorHandler') 

exports.SellerLogut = AsyncFunc(async(req,res,next)=>{
    const jwt_token = process.env.NODE_ENV === 'production' ? req.cookies.token : req.cookies.token_dev ;
    if(!jwt_token) return next(new ErrorHandler('You are unauthorized',400)) ;
    return res.status(200).clearCookie(process.env.NODE_ENV === 'production' ? 'token' : 'token_dev', { expires: new Date(0) }).json({data:"Logout Successfull."})

})