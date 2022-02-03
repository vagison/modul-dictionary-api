const { Sequelize } = require("sequelize");

const db = require("../util/database");

const Armenian = db.define("armenian", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  word: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},
{
  timestamps: false,
});

module.exports = Armenian;
