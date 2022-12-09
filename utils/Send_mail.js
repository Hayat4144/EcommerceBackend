const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

exports.Send_mail = async (res, next, response_message, reciever_email, subject, message) => {
    let transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL_ADDRESS,
            pass: process.env.PASSWORD,
        },
    });

    let mailoption = {
        from: process.env.SMTP_EMAIL_ADDRESSs,
        to: reciever_email,
        subject: subject,
        html: message,
    };

    transporter.sendMail(mailoption, (err, info) => {
        return err ? next(new ErrorHandler(err, 400)) : res.status(200).json({ data: response_message });
    });
};