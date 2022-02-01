const { Sequelize } = require("sequelize");

const db = require("../util/database");

const Login = db.define(
  "login",
  {
    user: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Login;
