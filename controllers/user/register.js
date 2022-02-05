// --- Importing required packages

// importing hashing mechanism package
const bcrypt = require("bcryptjs");

// importing Users model
const User = require("../../models/user");

// importing email RegExp
const { emailRegex } = require("../../util/regexp");

// --- Setting up and exporting user registration function
exports.register = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { email, password } = req.body;

    // Handling wrong input data
    if (!email || !email.match(emailRegex) || !password) {
      throw "Wrong user data!";
    }

    // Hashing the password
    const hash = await bcrypt.hash(password, 10);

    // Finding or creating the user
    const [existingUser, newUser] = await User.findOrCreate({
      where: {
        email: email,
      },
      defaults: { email: email, hash: hash },
    });

    // Sending status for successfully registered user
    if (newUser) {
      return res.status(200).send("User registered succesfully!");
    }

    // Sending status for already existing user
    else if (!newUser) {
      return res.status(200).send("User already exists!");
    }
  } 
  catch (error) {
    // If there was another error - send status 500
    res.status(500).send("Something else broke!");
  }
};
