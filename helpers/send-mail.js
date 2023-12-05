const nodemailer = require("nodemailer");
const { email } = require("../config");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: email.username,
    clientId: email.clientId,
    clientSecret: email.clientSecret,
    refreshToken: email.refreshToken,
  },
});

module.exports = transporter;
