const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const Example = db.define("example", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  englishExample: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
  armenianExample: {
    type: Sequelize.STRING(1000),
    allowNull: false,
  },
},
{
  timestamps: false,
});

module.exports = Example;
