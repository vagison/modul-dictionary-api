const { Sequelize } = require("sequelize");

const db = require("../util/database");

const Token = db.define(
  "token",
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

module.exports = Token;
