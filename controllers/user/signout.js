// --- Importing required packages

// importing cookie destroyer
const cookieDestroyer = require("../../util/cookie-destroyer");

// importing the database connection
const db = require("../../util/database");

// --- Setting up signout function
exports.signout = async (req, res, next) => {
  try {
    // Establishing transaction
    const transaction = await db.transaction();

    try {
      // Destroying cookies from the database
      await cookieDestroyer(req.cookies.user, transaction);

      // Commiting changes
      await transaction.commit();
    } 
    catch (error) {
      // If an error occured during cookies deletion - roll back the changes
      await transaction.rollback();
      throw "There was an error during cookies deletion!";
    }

    // Signing out the user and clearing the cookies for client side
    return res
      .status(200)
      .clearCookie("user")
      .clearCookie("login")
      .clearCookie("token")
      .send("User logged out succesfully!");
  } 
  catch (error) {
    // If there was another error - send status 500
    return res.status(500).send("Something else broke!");
  }
};
