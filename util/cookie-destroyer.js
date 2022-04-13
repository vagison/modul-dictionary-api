// --- Importing required packages

// importing cookies models
const Login = require("../models/user/login");
const Token = require("../models/user/token");

// --- Setting up cookieDestroyer function
async function cookieDestroyer(email, transaction) {
  try {
    // Destroying existing ones for the user
    await Login.destroy({ where: { user: email }, transaction: transaction });
    await Token.destroy({ where: { user: email }, transaction: transaction });
    
    return "Cookies are destroyed";
  } 
  catch (error) {
    throw "Cookies aren't destroyed";
  }
}

// --- Exporting cookieMaker function
module.exports = cookieDestroyer;
