const { saltRounds, email } = require("../config");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const emailService = require("../helpers/send-mail");
const crypto = require("crypto");

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
        csrfToken: req.csrfToken(),
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
  console.warn("tesssss");
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
    user.ResetTokenExpiration = Date.now() + 1000 * 60 * 60;
    await user.save();

    const mailOptions = {
      from: `"Hi Blog" <${email.from}>`,
      to: user.email,
      subject: "Reset Password",
      text: "This is the text content of the email.",
      html: ` 
                  <p>Click on the link below to reset your password.</p>
                  <p>
                    <a href="http://127.0.0.1:3000/account/reset-password/${token}" class="btn b  tn-link">Reset password</a>
                  </p>
       `,
    };
    let info = await emailService.sendMail(mailOptions);
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

module.exports = {
  getRegister,
  postRegister,
  getLogin,
  postLogin,
  getLogout,
  getReset,
  postReset,
};
