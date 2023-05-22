const ErrorHandler = require('../../utils/ErrorHandler');
const AsyncFunc = require('../../utils/AsyncFunc');
const SellerModel = require('../model/SellerModel');
const SellerEmailTokenModel = require('../model/EmailToken');
const { Send_mail } = require('../../utils/Send_mail')
const crypto = require('crypto')
const logger = require('../../utils/Logger')

const IsValidToken = async (user_id) => {
    try {
        const current_date = new Date().toISOString();
        const IsexpiredDocument = await SellerEmailTokenModel.find({
            user: user_id,
            expiresAt: { $lt: current_date },
        });
        if (IsexpiredDocument.length > 0) {
            await SellerEmailTokenModel.findByIdAndDelete(IsexpiredDocument[0]._id);
            return false;
        }
        return true;
    } catch (error) {
        logger.error(error);
    }
};

const createEmailToken = async (userId) => {
    try {
        const token = crypto.randomUUID();
        const doc = await SellerEmailTokenModel.create({
            seller: userId,
            token: token,
        });
        return doc;
    } catch (error) {
        throw new ErrorHandler(error, 400);
    }
};

exports.EmailChangeRequest = AsyncFunc(async (req, res, next) => {
    const { current_email } = req.body;
    const IsUserExist = await SellerModel.find({ _id: req.user_id, email: current_email })

    if (IsUserExist.length === 0) {
        return res.status(400).json({ error: `Sorry, ${current_email} does not exist.` })

    }
    const IstokenGenerated = await SellerEmailTokenModel.find({
        seller: req.user_id,
    });

    if (IstokenGenerated.length > 0) {
        const IsTokenValid = await IsValidToken(req.user_id);
        return IsTokenValid
            ? res.status(400).json({
                error: `Email reset link has been already send to your email.`,
            })
            : res.status(400).json({ error: "Sorry, your token has been expired." });
    }

    const doc = await createEmailToken(req.user_id);
    const link = `${req.get("origin")}/v2/auth/user/change/email/link/verify/${doc.user
        }/${doc.token}`;

    const subject = "Email change request";
    const message = `
        <html>
            <body>
            <h3>email Change in Taj Jwellery</h3>
            <h3>Here is link to verify your account : <a href=${link}>Click here to change your email </a></h3>
            </body>
        </html>`;
    const { info, error } = await Send_mail(
        IsUserExist[0].email,
        subject,
        message
    );

    if (error) return next(new ErrorHandler(error.message, 400));
    return res.status(200).json({
        data: `Reset email link has been send to your email ${IsUserExist[0].email}`,
    });


    // if (IstokenGenerated.length === 0) {
    //     await SellerEmailTokenModel.create({
    //         seller: req.user_id,
    //         token: crypto.randomUUID()
    //     }, async (err, doc) => {
    //         if (!err) {
    //             const link = `${process.env.FRONTEND_URL}/v3/seller/change/email/link/verify/${doc.seller}/${doc.token}`
    //             const subject = "Email change request"
    //             const message = `
    //                         <html>
    //                             <body>
    //                             <h3>Email Change in Taj Jwellery</h3>
    //                             <h3>Here is link to verify your account : <a href=${link}>Click here to change your email </a></h3>
    //                             </body>
    //                         </html>
    //                         `
    //             var response_message = `change email link has been sent to your your email ${current_email}. `
    //             await Send_mail(res, next, response_message, IsUserExist[0].email, subject, message,)

    //         }
    //         else {
    //             next(new ErrorHandler(err.message, 400))
    //         }
    //     })
    // } else {
    //     next(new ErrorHandler('An Email change link has been already send to your email.', 400))
    // }




})