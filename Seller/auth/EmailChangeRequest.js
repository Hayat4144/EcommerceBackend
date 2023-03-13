const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');
const SellerModel = require('../model/SellerModel');
const SellerEmailTokenModel = require('../model/EmailToken');
const { Send_mail } = require('../../utils/Send_mail')
const crypto = require('crypto')

exports.EmailChangeRequest = AsyncFunc(async (req, res, next) => {
    const { current_email } = req.body;
    const IsUserExist = await SellerModel.find({ _id: req.user_id, email: current_email })

    if (IsUserExist.length === 0) {
        next(new ErrorHandler(`Sorry, ${current_email} does not exist.`, 400))

    }
    const IstokenGenerated = await SellerEmailTokenModel.find({ seller: req.user_id });

    if (IstokenGenerated.length === 0) {
        await SellerEmailTokenModel.create({
            seller: req.user_id,
            token: crypto.randomUUID()
        }, async (err, doc) => {
            if (!err) {
                const link = `${process.env.FRONTEND_URL}/v3/seller/change/email/link/verify/${doc.seller}/${doc.token}`
                const subject = "Email change request"
                const message = `
                            <html>
                                <body>
                                <h3>Email Change in Taj Jwellery</h3>
                                <h3>Here is link to verify your account : <a href=${link}>Click here to change your email </a></h3>
                                </body>
                            </html>
                            `
                var response_message = `change email link has been sent to your your email ${current_email}. `
                await Send_mail(res, next, response_message, IsUserExist[0].email, subject, message,)

            }
            else {
                next(new ErrorHandler(err.message, 400))
            }
        })
    } else {
        next(new ErrorHandler('An Email change link has been already send to your email.', 400))
    }




})