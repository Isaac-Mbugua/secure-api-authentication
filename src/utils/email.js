const nodemailer = require("nodemailer");
const MailGen = require("mailgen");
require("dotenv").config();

const sendMail = async (email, name, intro, subject, action) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let MailGenerator = new MailGen({
    theme: "default",
    product: {
      name: "SECURE API",
      link: "https://mailgen.js",
    },
  });

  let response = {
    body: {
      name: name,
      intro: intro,
      action: action,
      outro: "Enjoy secure api athentication.",
    },
  };

  let mail = MailGenerator.generate(response);

  let message = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: mail,
  };

  try {
    await transporter.sendMail(message);
    console.log("Email sent.");
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
