const dotenv = require("dotenv");
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const { parsed: envs } = result;

const db = {
  host: envs.HOST,
  user: envs.DB_USERNAME,
  password: envs.DB_PASSWORD,
  database: envs.DB_NAME,
};

const size = 3;

const port = envs.PORT || 3000;

const saltRounds = envs.SALT_ROUNDS;

const secretKey = envs.SECRET_KEY;

const email = {
  username: envs.EMAIL_USERNAME,
  password: envs.EMAIL_PASSWORD,
  from: envs.EMAIL_FROM,
  clientId: envs.CLIENT_ID,
  clientSecret: envs.CLIENT_SECRET,
  refreshToken: envs.REFRESH_TOKEN,
  redirectUri: envs.REDIRECT_URI,
};

module.exports = { db, size, port, saltRounds, secretKey, email };
