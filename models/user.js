const { Sequelize } = require("sequelize");

const db = require("../util/database");

const User = db.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    hash: {
      type: Sequelize.STRING,
      unique: false,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = User;
