const { DataTypes } = require("sequelize");
const sequelize = require("../data/db");

const Blog = sequelize.define(
  "blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    homePage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    approval: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    validate: {
      checkValidOnay() {
        if (this.homePage && !this.approval) {
          throw new Error(
            "You didn't approve the blog page you put on the homepage."
          );
        }
      },
    },
  }
);

module.exports = Blog;
