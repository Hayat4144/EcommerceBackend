const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');
const UserModel = require('../Model/UserModel');
const UserPasswordTokenModel = require('../Model/UserPasswordToken');
const { Send_mail } = require('../../utils/Send_mail')
const crypto = require('crypto')

exports.UserPasswordReset = AsyncFunc(async (req, res, next) => {
    const { current_email } = req.body;
    const IsUserExist = await UserModel.find({ _id: req.user_id, email: current_email })

    if (IsUserExist.length === 0) {
        return res.status(400).json({ error: `Sorry, ${current_email} does not exist.` })
    }
    const IstokenGenerated = await UserPasswordTokenModel.find({ user: req.user_id });

    if (IstokenGenerated.length === 0) {
        await UserPasswordTokenModel.create({
            user: req.user_id,
            token: crypto.randomUUID()
        }, async (err, doc) => {
            if (!err) {
                const link = `${req.get('origin')}/v2/auth/user/change/password/link/verify/${doc.user}/${doc.token}`
                const subject = "Email change request"
                const message = `
                            <html>
                                <body>
                                <h3>password Change in Taj Jwellery</h3>
                                <h3>Here is link to verify your account : <a href=${link}>Click here to change your password </a></h3>
                                </body>
                            </html>
                            `
                var response_message = `Reset password link has been sent to your your email ${current_email}. `
                await Send_mail(res, next, response_message, IsUserExist[0].email, subject, message,)

            }
            else {
                next(new ErrorHandler(err, 400))
            }
        })
    } else {
        next(new ErrorHandler('Password reset link has been already send to your email.', 400))
    }

})