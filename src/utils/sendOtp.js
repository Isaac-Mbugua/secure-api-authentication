const crypto = require("crypto");
const User = require("../models/user");
const sendMail = require("./email");

async function sendOtp(email,name) {
  const otpCode = crypto.randomInt(100000, 999999).toString();

  await User.update({ authCode: otpCode }, { where: { email } });

  await sendMail(
    email,
    name,
    `Your authentication code is ${otpCode}`,
    "AUTHENTICATION CODE",
    null
  );

  return otpCode;
}

module.exports = sendOtp;
