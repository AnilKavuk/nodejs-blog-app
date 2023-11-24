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

const port = envs.PORT;

const saltRounds = envs.SALT_ROUNDS;

module.exports = { db, size, port, saltRounds };
