// importing the database and the required models for the words and comparisons
const db = require("../../../util/database");
const EnglishComparisonConnector = require("../../../models/data/english-comparison-connector");
const EnglishComparison = require("../../../models/data/english-comparison");
const ArmenianComparisonConnector = require("../../../models/data/armenian-comparison-connector");
const ArmenianComparison = require("../../../models/data/armenian-comparison");

// importing RegExp constrains
// const { armChars, engChars, numChars } = require("../../../util/regexp");

// --- Setting up and exporting translation's registration function
exports.registerComparison = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { language, comparisonText, words, } = req.body;

    // User wrong input handling
    if (comparisonText.length === 0 || typeof (comparisonText) !== "string") {
      return res.status(500).send("Wrong comparison text entered!");
    }

    if (words.length === 0) {
      return res.status(500).send("No words selected!")
    }

    if (language !== 0 && language !== 1 || typeof (language) !== "number") {
      return res.status(500).send("Wrong language selected!")
    }

    // Registering comparison
    // Establishing transaction
    const transaction = await db.transaction();
    try {
      // Setting parameters depending on comparison language
      const languageSettings = language === 0
        ? {
          ComparisonConnectorTable: ArmenianComparisonConnector,
          ComparisonTable: ArmenianComparison,
          comparisonIdColumn: "armenianComparisonId",
          wordIdColumn: "armenianId"
        }
        : {
          ComparisonConnectorTable: EnglishComparisonConnector,
          ComparisonTable: EnglishComparison,
          comparisonIdColumn: "englishComparisonId",
          wordIdColumn: "englishId"
        }

      // Creating a comparison
      const comparisonCreated = await languageSettings["ComparisonTable"].create({
        comparison: comparisonText,
      },
        { transaction: transaction }
      );

      // Taking newely created comparison's id
      const comparisonId = comparisonCreated.id;

      // Registering connectors between newely created comparison and selected words
      await Promise.all(
        words.map(async word => {
          await languageSettings["ComparisonConnectorTable"].findOrCreate({
            where: {
              [languageSettings["comparisonIdColumn"]]: comparisonId,
              [languageSettings["wordIdColumn"]]: word["value"],
            },
            defaults: {
              [languageSettings["comparisonIdColumn"]]: comparisonId,
              [languageSettings["wordIdColumn"]]: word["value"],
            },
            transaction: transaction,
          });
        })
      );

      // Commiting the comparison
      await transaction.commit();

      // Sending status for successfully registered translation
      return res.status(200).send("Comparison registered succesfully!");
    }
    catch (error) {
      await transaction.rollback();
      return res.status(500).send("Wrong comparison entered!");
    }
  }

  catch (error) {
    // If there was another error - send status 500
    res.status(500).send("Something else broke!");
  }
};
