require("dotenv").config();

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    define: {
      timestamps: false,
    },
  }
);

const connect = async () => {
  try {
    await sequelize.authenticate();
    console.warn("mysql server");
  } catch (err) {
    console.warn("connection error: ", err);
  }
};

connect();

module.exports = sequelize;

//* sequelize olmadan

// let connection = mysql.createConnection(config.db)

// connection.connect((error) => {
//     if (error) {
//         return console.warn(error)
//     }

//     console.warn("mysql server bağlantısı yapıldı")
// })

// module.exports = connection.promise();
