const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const FieldConnector = db.define("field_connector", {
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

module.exports = FieldConnector;
