const { saltRounds, email } = require("../config");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const crypto = require("crypto");
const { Op } = require("sequelize");

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

    const mailOptions = {
      from: email.from,
      to: newUser.email,
      subject: "Your account has been created",
      text: `Hi ${newUser.fullName},
  You have successfully registered to the blog page.
                `,
    };

    const info = await emailService.sendMail(mailOptions);
    console.warn(info);
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
        csrfToken: req.csrfToken(),
      });
    }

    //password checking
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const userRoles = await user.getRoles({
        attributes: ["roleName"],
        raw: true,
      });
      req.session.roles = await userRoles.map((role) => role["roleName"]);
      req.session.isAuth = true;
      req.session.fullName = user.fullName;
      req.session.userId = user.id;
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

const getReset = async (req, res) => {
  const message = req.session.message;
  delete req.session.message;
  try {
    return res.render("auth/reset-password", {
      title: "reset password",
      message: message,
    });
  } catch (err) {
    console.warn(err);
  }
};

const postReset = async (req, res) => {
  const email = req.body.email;
  try {
    var token = crypto.randomBytes(32).toString("hex");
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      req.session.message = {
        text: "Email not found",
        class: "warning",
      };
      return res.redirect("reset-password");
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await user.save();

    const mailOptions = {
      from: `"Hi Blog" <${email.from}>`,
      to: user.email,
      subject: "Reset Password",
      text: "This is the text content of the email.",
      html: ` 
      <p>Click on the link below to reset your password.</p>
      <p>
        <a href="http://127.0.0.1:3000/account/new-password/${token}" target="_blank" class="btn b  tn-link">Reset password</a>
      </p>
       `,
    };
    const info = await emailService.sendMail(mailOptions);
    console.warn(info);
    req.session.message = {
      text: "Check Email to reset password",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    console.warn(err);
  }
};

const getNewPassword = async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!user) {
      req.session.message = {
        text: "An unexpected problem was encountered",
        class: "danger",
      };

      res.render("auth/login", {
        title: "login",
      });

      return res.redirect("login");
    }
    return res.render("auth/new-password", {
      title: "new password",
      token: token,
      userId: user.id,
    });
  } catch (err) {
    console.warn(err);
  }
};

const postNewPassword = async (req, res) => {
  const token = req.body.token;
  const userId = req.body.userId;
  const newPassword = req.body.password;
  try {
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiration: {
          [Op.gt]: Date.now(),
        },
        id: userId,
      },
    });

    if (!user) {
      req.session.message = {
        text: "An unexpected problem was encountered",
        class: "danger",
      };
      return res.redirect("login");
    }

    user.password = await bcrypt.hashSync(newPassword, Number(saltRounds));
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    req.session.message = {
      text: "Your password has been successfully updated",
      class: "success",
    };
    return res.redirect("login");
  } catch (err) {
    console.warn(err);
  }
};

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
};
