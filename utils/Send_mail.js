const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

exports.Send_mail = async (user, subject) => {
  try {
    const emailTemplate = fs.readFileSync(
      "template/password-reset-template.html",
      "utf-8"
    );
    const renderedEmail = ejs.render(emailTemplate, {
      name: user.name,
      link: user.link,
    });
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
      to: user.email,
      subject: subject,
      html: renderedEmail,
    };

    const info = await transporter.sendMail(mailoption);
    return { info };
  } catch (error) {
    return { error };
  }
};
