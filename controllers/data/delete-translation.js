// --- Importing required packages

// importing the database and the translations model
const db = require("../../util/database");
const Translation = require("../../models/translation");

// importing unused words deleting function
const deleteUnusedWords = require("../../util/delete-unused-words");

// --- Setting up and exporting translation deleting function
exports.deleteTranslation = async (req, res, next) => {
  try {
    // Getting the translation id from the request
    const { translationId } = req.body;

    // Searching required translation by id
    if (typeof translationId === "number") {
      const translation = await Translation.findOne({
        where: {
          id: translationId,
        },
      });

      // If translation found
      if (translation !== null) {
        // Extracting related english and armenian word's ID's to check (if not used - remove)
        const englishWordId = translation["englishId"];
        const armenianWordId = translation["armenianId"];

        // Establishing transaction
        const transaction = await db.transaction();

        try {
          // Removing the instance of translation
          await translation.destroy({ transaction: transaction });

          // Unused words handling
          await deleteUnusedWords(
            translationId,
            englishWordId,
            armenianWordId,
            transaction
          );

          // Commiting changes
          await transaction.commit();

          // Sending status for successfully deleted translation
          return res.status(200).send("Translation deleted!");
        } 
        catch {
          // If an error occured during the translation deletion - roll back the changes
          await transaction.rollback();

          // Throw an error for unsuccessfull deletion
          throw "Something went wrong during transaction!";
        }
      } 
      // If translation not found
      else {
        // Throw an error as translation not found
        throw "No translation found!";
      }
    }

    // Incorrect data to find a translation
    else {
      // Throw an error as there was a wrong data to find a translation
      throw "Wrong translation data selected!";
    }
  } 
  catch (error) {    
    // If there was an error during finding a translation or it's deletion - send status 500 and the error
    if (
      error === "No translation found!" ||
      error === "Wrong translation data selected!" ||
      error === "Something went wrong during transaction!"
    ) {
      return res.status(500).send(error);
    }
    // If there was another error - send status 500 
    else {
      return res.status(500).send("Something else broke!");
    }
  }
};
