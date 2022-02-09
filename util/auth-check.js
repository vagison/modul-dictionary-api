// --- Importing required packages

// importing cookies models
const Login = require("../models/login");
const Token = require("../models/token");

// --- Setting up authorization handling function
async function authChecker(req, res, next) {
  console.log("dasda", req.cookies)
  console.log("others", req.cookies.user, req.cookies.login, req.body.token)
  async function checking(userCookie, loginCookie, tokenValue) {
    // Throw error if no cookies detected
    if (!userCookie || !loginCookie || !tokenValue) {
      throw "Please authorize first!";
    }

    // Searching for login cookie
    const login = await Login.findOne({
      where: {
        user: userCookie,
        value: loginCookie,
      },
    });

    // If login cookie exists
    if (login) {
      // Searching for the token
      const token = await Token.findOne({
        where: {
          user: userCookie,
          value: tokenValue,
        },
      });

      // If token doesn't exist - throw an error
      if (!token) {
        throw "Token is invalid!";
      }
      // If token also exists - return successfuly checked
      else {
        return "Successfully checked!";
      }
    }

    // If login cookie doesn't exist - throw an error
    else {
      throw "User with cookies not found!";
    }
  }

  try {
    // Checking if the user is properly signed-in
    await checking(req.cookies.user, req.cookies.login, req.body.token);
    next();
  } 
  catch(error) {
    // If there was an error during authorization process - send status 401 and the error
    if (
      error === "Please authorize first!" ||
      error === "Token is invalid!" ||
      error === "User with cookies not found!"
    ) {
      return res.status(401).send("Please authorize first!");
    }
    // If there was another error - send status 500
    else {
      res.status(500).send("Something else broke during authorization!");
    }
  }
}

// --- Exporting authorization handling function
module.exports = authChecker;
