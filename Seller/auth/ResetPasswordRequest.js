const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');
const SellerModel = require('../model/SellerModel');
const SellerPasswordTokenModel = require('../model/SellerPasswordToken');
const { Send_mail } = require('../../utils/Send_mail')
const crypto = require('crypto')

exports.ResetPasswordRequest = AsyncFunc(async (req, res, next) => {
    const { current_email } = req.body;
    const IsUserExist = await SellerModel.find({ _id: req.user_id, email: current_email })

    if (IsUserExist.length === 0) {
        return res.status(400).json({ error: `Sorry, ${current_email} does not exist.` })
    }
    const IstokenGenerated = await SellerPasswordTokenModel.find({ seller: req.user_id });

    if (IstokenGenerated.length === 0) {
        await SellerPasswordTokenModel.create({
            seller: req.user_id,
            token: crypto.randomUUID()
        }, async (err, doc) => {
            if (!err) {
                const link = `${process.env.FRONTEND_URL}/v2/auth/seller/change/password/link/verify/${doc.seller}/${doc.token}`
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