// --- Importing required packages

// importing ORM packages
const { Op } = require("sequelize");

// importing fields model
const Field = require("../../../models/data/field");

// --- Setting up and exporting field searching function
exports.searchField = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { searchedField } = req.body;

    // Creating a filter
    const filter = searchedField + "%";

    // Picking fields
    const fields = await Field.findAll({
      where: {
        field: { [Op.like]: filter },
      },
      raw: true,
    });

    // Sending successfully found fields and the status code
    return res.status(200).send(fields);
  } 
  catch (error) {
    // If there was an error - send status 500 
    return res.status(500).send("Something else broke!");
  }
};
