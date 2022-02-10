// --- Importing required packages

// importing random string generator package
const Randomstring = require("randomstring");

// importing cookie destroyer
const cookieDestroyer = require("./cookie-destroyer");

// importing the database connection
const db = require("./database");

// importing cookies models
const Login = require("../models/login");
const Token = require("../models/token");

// --- Setting up cookieMaker function
async function cookieMaker(email, res) {
  // Establishing transaction
  const transaction = await db.transaction();
  try {
    // Creating login cookie value (aka first-piece)
    const loginCookieValue = Randomstring.generate({
      length: 50,
      charset: "alphanumeric",
    });

    // Creating token cookie value (aka second-piece)
    const tokenCookieValue = Randomstring.generate({
      length: 50,
      charset: "alphanumeric",
    });

    // Destroying existing ones for the user
    await cookieDestroyer(email, transaction);

    // Creating new ones
    await Login.create(
      {
        // where: {
        user: email,
        value: loginCookieValue,
        // },
        // raw: true,
      },
      { transaction: transaction }
    );

    await Token.create(
      {
        // where: {
        user: email,
        value: tokenCookieValue,
        // },
        // raw: true,
      },
      { transaction: transaction }
    );

    // Commiting changes
    await transaction.commit();

    // Creating expiration date for the newly created cookies
    const cookieExpirationDate = new Date(
      new Date().getTime() + 365 * 24 * 60 * 60 * 1000
    );

    const txt = "2023-02-10T09:56:09.799Z"


    console.log("txt: ", txt)
    console.log("cookieExpirationDate: ", cookieExpirationDate)
    
    // res.set('token', tokenCookieValue) 
    // res.set('token-expiration', cookieExpirationDate) 

    // Returning cookies an status 200 as success
    return res
      .status(200)
      .set('token', tokenCookieValue) 
      .set('token-expiration', txt) 
      .cookie("user", email, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        // path: "/",
        expires: txt,
      })
      .cookie("login", loginCookieValue, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        // path: "/",
        expires: txt,
      })
  }
  catch (error) {
    // If an error occured during cookies creation - roll back the changes
    await transaction.rollback();
    throw "Cookies aren't created!";
  }
}

// --- Exporting cookieMaker function
module.exports = cookieMaker;
