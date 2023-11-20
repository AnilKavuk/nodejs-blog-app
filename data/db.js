const Sequelize = require("sequelize");
const { db } = require("../config");

const sequelize = new Sequelize(db.database, db.user, db.password, {
  dialect: "mysql",
  host: db.host,
  define: {
    timestamps: false,
  },
});

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
