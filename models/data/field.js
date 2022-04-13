const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const Field = db.define("field", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  field: {
    type: Sequelize.STRING,
    allowNull: false,
  },
},
{
  timestamps: false,
});

module.exports = Field;
