// --- Importing required packages

// importing ORM packages
const { Sequelize } = require("sequelize");

// --- Creating the database connection
const db = new Sequelize(process.env.JAWSDB_URL);

// --- Exporting the database connection
module.exports = db;
