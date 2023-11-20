const User = require("../models/user");
const bcrypt = require("bcrypt");

const getRegister = async (req, res) => {
  try {
    return res.render("auth/register", {
      title: "register",
    });
  } catch (err) {
    console.warn(err);
  }
};

const postRegister = async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  data.password = bcrypt.hashSync(data.password, 10);
  try {
    await User.create({
      fullName: data.name,
      email: data.email,
      password: data.password,
    });
    return res.redirect("login");
  } catch (err) {
    console.warn(err);
  }
};

module.exports = { getRegister, postRegister };
