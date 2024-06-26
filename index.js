// express modules
const express = require("express");

//  routes
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

// node modules
const path = require("path");

// custom modules
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const locals = require("./middlewares/locals");
const log = require("./middlewares/log");
const error = require("./middlewares/error-handling");

// models
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
const Role = require("./models/role");

// configs
const { port, secretKey } = require("./config");

const cookieParser = require("cookie-parser");
const session = require("express-session");
const SequlizeStore = require("connect-session-sequelize")(session.Store);
const csurf = require("csurf");

const app = express();

// template engine
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
    store: new SequlizeStore({
      db: sequelize,
    }),
  })
);

app.use(locals);
app.use(csurf());

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);
app.use(log);
app.use(error);
app.use("*", (req, res, next) => {
  res.status(404).render("error/404", { title: "not found" });
  next();
});

Blog.belongsTo(User);
User.hasMany(Blog);

Blog.belongsToMany(Category, { through: "blogCategories" });
Category.belongsToMany(Blog, { through: "blogCategories" });

Role.belongsToMany(User, { through: "userRole" });
User.belongsToMany(Role, { through: "userRole" });

(async () => {
  // await sequelize.sync({ force: true });
  // await dummyData();
})();

app.listen(port, () => {
  console.log("listening on port ", port);
});
