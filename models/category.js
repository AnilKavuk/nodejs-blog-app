const { DataTypes } = require('sequelize');
const sequelize = require('../data/db');

const Category = sequelize.define("category", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dataAddDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Category;