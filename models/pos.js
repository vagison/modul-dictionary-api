const { Sequelize } = require("sequelize");

const db = require("../util/database");

const PartOfSpeech = db.define(
  "pos",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    pos: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    name: {
      singular: "pos",
      plural: "poses",
    },
    timestamps: false,
  }
);

module.exports = PartOfSpeech;
