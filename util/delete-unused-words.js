// --- Importing required packages

// importing ORM packages
const sequelize = require("sequelize");

// importing required models for the words and translations
const English = require("../models/data/english");
const Armenian = require("../models/data/armenian");
const Translation = require("../models/data/translation");

// --- Setting up unused words deleting function
async function deleteUnusedWords(
  translationId,
  englishWordId,
  armenianWordId,
  transaction
) {
  // Establishing dynamic function to check if there is another translation using the word
  async function wordUsage(languageColumnName, wordId) {
    if (wordId !== null) {
      return await Translation.findOne({
        where: {
          id: { [sequelize.Op.not]: translationId },
          [languageColumnName]: wordId,
        },
      });
    } else {
      return "no changes";
    }
  }

  // Searching with englishID to check if there is another translation, using the word
  const englishWordsUsage = await wordUsage("englishId", englishWordId);

  // Searching with armenianID to check if there is another translation, using the word
  const armenianWordsUsage = await wordUsage("armenianId", armenianWordId);

  // Searching english word in Englishes table, in case there was a change
  const englishWordToDelete =
    englishWordId !== null
      ? await English.findOne({
        where: {
          id: englishWordId,
        },
      })
      : "";

  // Searching armenian word in Armenians table, in case there was a change
  const armenianWordToDelete =
    armenianWordId !== null
      ? await Armenian.findOne({
        where: {
          id: armenianWordId,
        },
      })
      : "";

  // If english word is not used anymore in any other translation - destroy the word!
  englishWordsUsage === null
    ? await englishWordToDelete.destroy({ transaction: transaction })
    : console.log("English word is used");

  // If armenian word is not used anymore in any other translation - destroy the word!
  armenianWordsUsage === null
    ? await armenianWordToDelete.destroy({ transaction: transaction })
    : console.log("Armenian word is used");
}

// --- Exporting unused words deleting function
module.exports = deleteUnusedWords;
