const AsyncFunc = require("../../utils/AsyncFunc");

exports.CheckAuth  = AsyncFunc(async(req,res,next)=>{
    return res.status(200).clearCookie(process.env.NODE_ENV === 'production' ? 'token' : 'token_dev', { expires: new Date(0) }).json({data:'authenticate'})
})