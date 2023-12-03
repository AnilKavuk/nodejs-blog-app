const nodemailer = require("nodemailer");
const { email } = require("../config");

var transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: true,
  tls: {
    ciphers: "SSLv3",
  },
  auth: {
    type: "OAuth2",
    user: email.username,
    pass: email.password,
    clientId: email.clientId,
    clientSecret: email.clientSecret,
    refreshToken: email.refreshToken,
  },
});

module.exports = transporter;
