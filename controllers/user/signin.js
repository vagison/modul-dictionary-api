// --- Importing required packages

// importing hashing mechanism package
const bcrypt = require("bcryptjs");

// importing Users model
const User = require("../../models/user");

// importing email RegExp
const { emailRegex } = require("../../util/regexp");

// importing cookie-making mechanism
const cookieMaker = require("../../util/cookie-maker");

// --- Setting up and exporting user login function
exports.signin = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { email, password } = req.body;

    // Handling wrong input data
    if (!email || !email.match(emailRegex) || !password) {
      return res.status(500).send("Wrong user data!");
    }

    // Finding the user
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    // If user found
    if (user) {
      // Comparing input password hash and stored one
      const validPass = await bcrypt.compare(password, user.hash);

      // If the password is correct
      if (validPass) {
        // Making cookies for the user
        const cookies = await cookieMaker(email, res);

        // Sending status for successfully logging in
        if (cookies) {
          console.log("Stee", cookies)

          return cookies.send("User logged in succesfully!");
        }
      }

      // If the password is incorrect
      else {
        // Sending status 500 for the incorrect password
        return res.status(500).send("Wrong password!");
      }
    }

    // If user is not found
    else {
      // Sending status 404 for not existing user
      return res.status(404).send("User not found!");
    }
  } 
  catch (error) {
    // If there was another error - send status 500
    res.status(500).send("Something else broke!");
  }
};
