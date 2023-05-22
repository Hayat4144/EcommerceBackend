const nodemailer = require("nodemailer");
const ErrorHandler = require("./ErrorHandler");

exports.Send_mail = async (email, subject, message) => {
  try {
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
      to: email,
      subject: subject,
      html: message,
    };

    const info = await transporter.sendMail(mailoption);
    return { info };
  } catch (error) {
    return { error };
  }
};
