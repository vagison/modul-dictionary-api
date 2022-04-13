const { Sequelize } = require("sequelize");

const db = require("../../util/database");

const Translation = db.define(
  "translation",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    qualityEngArm: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 10,
      },
    },
    qualityArmEng: {
      type: Sequelize.INTEGER,
      validate: {
        min: 1,
        max: 10,
      },
    },
    pronunciation: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    abbreviationEng: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
    abbreviationArm: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Translation;
