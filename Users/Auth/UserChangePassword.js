const UserModel = require('../Model/UserModel')
const bcrypt = require('bcrypt')
const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');



exports.UserChangePassword = AsyncFunc(async (req, res, next) => {
    const { currentpassword, newpassword } = req.body;
    await UserModel.findById(req.user_id)
        .exec(async (err, doc) => {
            if (err) {
                next(new ErrorHandler('Sorry , the data does not exist.', 400))
            }
            if (await bcrypt.compare(currentpassword, doc.password)) {
                const saltRound = 10;
                const hashpassword = await bcrypt.hash(newpassword, saltRound);
                await UserModel.findByIdAndUpdate(doc._id, { $set: { password: hashpassword } }, { $new: true })
                    .exec((error, doc) => {
                        if (error) {
                            next(new ErrorHandler(error.message, 400))
                        }
                        else {
                            if (doc === null) {
                                return res.status(400).json({ 'error': `Sorry , User does not exist` })
                            }
                            return res.status(200).json({ data: "The password has been changed successfully." })
                        }
                    })
            }
            else {
                next(new ErrorHandler('Sorry, your password is wrong try again.', 400))
            }
        })

})
