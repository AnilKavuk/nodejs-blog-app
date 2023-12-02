const { saltRounds, email } = require("../config");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");

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
  const data = req.body;
  data.password = bcrypt.hashSync(req.body.password, Number(saltRounds));

  try {
    const user = await User.findOne({ where: { email: data.email } });
    if (user) {
      req.session.message = {
        text: "You have already registered with the e-mail address you entered.",
        class: "warning",
      };
      return res.redirect("login");
    }
    const newUser = await User.create({
      fullName: data.name,
      email: data.email,
      password: data.password,
    });

    emailService.sendMail(
      {
        from: email.from,
        to: newUser.email,
        subject: "Your account has been created",
        text: `Hi ${newUser.fullName},
        
        You have successfully registered to the blog page.
                `,
      },
      (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
      }
    );

    req.session.message = {
      text: "You can log in to your account.",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    console.warn(err);
  }
};

const getLogin = async (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/login", {
      title: "login",
      message: message,
      csrfToken: req.csrfToken(),
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
        message: {
          text: "email or password wrong!",
          class: "danger",
        },
      });
    }

    //password checking
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.isAuth = true;
      req.session.fullName = user.fullName;
      const url = req.query.returnUrl || "/";
      return res.redirect(url);
    } else {
      return res.render("auth/login", {
        title: "login",
        message: {
          text: "email or password wrong!",
          class: "danger",
        },
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
