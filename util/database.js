// --- Importing required packages

// importing ORM packages
const { Sequelize } = require('sequelize')

// --- Creating the database connection
const db = process.env.JAWSDB_URL & process.env.ENVIRONMENT === "PRODUCTION"
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_SCHEME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
      dialect: process.env.DB_DIALECT,
      host: process.env.DB_HOST
    })

// --- Exporting the database connection
module.exports = db
