// --- Importing required packages

// importing ORM packages
const { Sequelize } = require('sequelize')

// --- Creating the database connection
const db = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize('modul-dict', 'root', 'admin', {
      dialect: 'mysql',
      host: 'localhost'
    })

// --- Exporting the database connection
module.exports = db
