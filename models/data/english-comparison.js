const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const EnglishComparison = db.define("english_comparison", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  comparison: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},
{
  timestamps: false,
});

module.exports = EnglishComparison;
