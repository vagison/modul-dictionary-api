const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const Definition = db.define("definition", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  englishDefinition: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  armenianDefinition: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
},
{
  timestamps: false,
});

module.exports = Definition;
