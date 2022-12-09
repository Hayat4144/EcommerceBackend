const AsyncFunc = require('../../utils/AsyncFunc');
const ErrorHandler = require('../../utils/ErrorHandler');
const UserEmailToken = require('../Model/UserEmailToken')
const UserModel = require('../Model/UserModel')

exports.VerifyEmailChange = AsyncFunc(async (req, res, next) => {
    const { new_email, token } = req.body;
    const IsValidToken = await UserEmailToken.find({ token });
    if (IsValidToken.length === 0) {
        next(new ErrorHandler(`Sorry , Invalid or Broken link`, 400))
    }
    await UserModel.findByIdAndUpdate(req.user_id, { $set: { email: new_email } }, { $new: true })
        .exec((error, doc) => {
            if (error) {
                next(new ErrorHandler(error.message, 400))
            }
            else {
                if (doc === null) {
                    return res.status(400).json({ 'error': `Sorry , User does not exist` })
                }
                return res.status(200).json({ data: `The Email has been changed successfully to ${doc.email}` })
            }
        })
})
