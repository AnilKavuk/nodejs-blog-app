const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Blog = sequelize.define("blog", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    homePage: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    approval: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Blog;