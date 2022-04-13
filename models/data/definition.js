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
    type: Sequelize.STRING,
    allowNull: false,
  },
  armenianDefinition: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},
{
  timestamps: false,
});

module.exports = Definition;
