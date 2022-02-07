// --- Importing required packages

// importing ORM packages
const { Sequelize } = require("sequelize");

// --- Creating the database connection
const db = new Sequelize(process.env.JAWSDB_URL);

// const db = new Sequelize("heroku_8e735f498ab729b", "bf6f17aa9a7172", "a0067d96", {
//   dialect: "mysql",
//   host: "us-cdbr-east-05.cleardb.net",
// });

// --- Exporting the database connection
module.exports = db;


// // --- Importing required packages

// // importing ORM packages
// const { Sequelize } = require("sequelize");

// // --- Creating the database connection
// const db = new Sequelize("modul-dict", "postgres", "test", {
//   dialect: "postgres",
//   host: "localhost",
// });

// // --- Exporting the database connection
// module.exports = db;

