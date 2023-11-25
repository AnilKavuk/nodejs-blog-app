const { saltRounds } = require("../config");
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
  data.password = bcrypt.hashSync(data.password, saltRounds);
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

const getLogin = async (req, res) => {
  try {
    return res.render("auth/login", {
      title: "login",
    });
  } catch (err) {
    console.warn(err);
  }
};

const postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.render("auth/login", {
        title: "login",
        message: "email or password wrong!",
      });
    }

    //password checking
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.isAuth = true;
      req.session.fullName = user.fullName;
      return res.redirect("/");
    } else {
      return res.render("auth/login", {
        title: "login",
        message: "email or password wrong!",
      });
    }
  } catch (err) {
    console.warn(err);
  }
};

const getLogout = async (req, res) => {
  try {
    await req.session.destroy();
    return res.redirect("login");
  } catch (err) {
    console.warn(err);
  }
};

module.exports = { getRegister, postRegister, getLogin, postLogin, getLogout };
