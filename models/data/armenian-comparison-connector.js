const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const ArmenianComparisonConnector = db.define("armenian_comparison_connector", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  }
},
{
  timestamps: false,
});

module.exports = ArmenianComparisonConnector;
