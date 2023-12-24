const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");
const { saltRounds } = require("../config");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "user",
  {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Your first and last name must be entered.<br/>",
        },
        isFullName(value) {
          if (value.split(" ").length < 2) {
            throw new Error("Your first and last name must be entered.<br/>");
          }
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "You have already registered with the e-mail address you entered.",
      },
      validate: {
        notEmpty: {
          msg: "Email cannot be left blank.<br/>",
        },
        isEmail: { msg: "you must enter e-mail.<br/>" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password cannot be left blank.<br/>",
        },
        len: {
          args: [5, 10],
          msg: "There should be between 5-10 passwords.<br/>",
        },
      },
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { timestamps: true }
);

User.afterValidate(async (user) => {
  user.password = bcrypt.hashSync(user.password, Number(saltRounds));
});

module.exports = User;
