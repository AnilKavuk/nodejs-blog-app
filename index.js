const express = require("express");
const path = require("path");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");
const sequelize = require("./data/db");
const dummyData = require("./data/dummy-data");
const Category = require("./models/category");
const Blog = require("./models/blog");
const User = require("./models/user");
const { port } = require("./config");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use("/libs", express.static(path.join(__dirname, "node_modules")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use("/account", authRoutes);
app.use(userRoutes);

//relationships
// // one to many
// Category.hasMany(Blog, {
//     foreignKey: {
//         name: 'categoryId',
//         allowNull: true,
//         // defaultValue: 1
//     },
//     onDelete: "SET NULL",
//     onUpdate: "SET NULL"
// });
// Blog.belongsTo(Category);

// many to many

//implementing relationships - sync

// IIFE

Blog.belongsTo(User);
User.hasMany(Blog);

Blog.belongsToMany(Category, { through: "blogCategories" });
Category.belongsToMany(Blog, { through: "blogCategories" });

(async () => {
  await sequelize.sync({ alter: true });
  await dummyData();
})();

app.listen(port, () => {
  console.log("listening on port ", port);
});
