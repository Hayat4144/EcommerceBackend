const AsyncFunc = require('../../utils/AsyncFunc');
const ErrorHandler = require('../../utils/ErrorHandler');
const UserPasswordToken = require('../Model/UserPasswordToken')
const UserModel = require('../Model/UserModel')
const bcrypt = require('bcrypt')

exports.VerifyPasswordChange = AsyncFunc(async (req, res, next) => {
    const { new_password, token } = req.body;
    const IsValidToken = await UserPasswordToken.find({ token });
    if (IsValidToken.length === 0) {
        next(new ErrorHandler(`Sorry , Invalid/Broken link or token`, 400))
    }
    const saltRound = 10;
    const hashpassword = await bcrypt.hash(new_password, saltRound);
    await UserModel.findByIdAndUpdate(req.user_id, { $set: { password: hashpassword } }, { $new: true })
        .exec((error, doc) => {
            if (error) {
                next(new ErrorHandler(error.message, 400))
            }
            else {
                if (doc === null) {
                    return res.status(400).json({ 'error': `Sorry , User does not exist` })
                }
                return res.status(200).json({ data: `The password has been changed successfully .` })
            }
        })
})
