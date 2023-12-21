const nodemailer = require("nodemailer");
const { email } = require("../config");
const { OAuth2Client } = require("google-auth-library");

const oAuth2Client = new OAuth2Client(
  email.clientId,
  email.clientSecret,
  email.RedirectUri
);
oAuth2Client.setCredentials({ refresh_token: email.refreshToken });

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
    accessToken: oAuth2Client.getAccessToken(),
  },
});

transporter.set("oauth2_provision_cb", (user, renew, callback) => {
  let accessToken = userTokens[user];
  if (!accessToken) {
    return callback(new Error("Unknown user"));
  } else {
    return callback(null, accessToken);
  }
});

transporter.on("token", (token) => {
  console.log("A new access token was generated");
  console.log("User: %s", token.user);
  console.log("Access Token: %s", token.accessToken);
  console.log("Expires: %s", new Date(token.expires));
});

module.exports = transporter;
