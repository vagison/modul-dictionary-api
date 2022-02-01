// --- Importing required packages

// importing ORM packages
const { Op } = require("sequelize");

// importing required models for the words and translations
const PartOfSpeech = require("../../models/pos");

// --- Setting up and exporting POS searching function
exports.searchPOS = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { searchedPOS } = req.body;

    // Creating a filter
    const filter = searchedPOS + "%";

    // Picking POS
    const pos = await PartOfSpeech.findAll({
      where: {
        pos: { [Op.like]: filter },
      },
      attributes: ["id", "pos"],
    });

    // Sending successfully found POS and the status code
    return res.status(200).send(pos);
  } 
  catch (error) {
    // If there was an error - send status 500 
    return res.status(500).send("Something else broke!");
  }
};
