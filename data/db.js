const { config } = require("../config");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    dialect: "mysql",
    host: config.db.host,
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
