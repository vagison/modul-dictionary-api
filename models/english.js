const { Sequelize } = require("sequelize");

const db = require("../util/database");

const English = db.define("english", {
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

module.exports = English;
