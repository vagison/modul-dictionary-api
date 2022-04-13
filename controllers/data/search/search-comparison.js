// --- Importing required packages

// importing ORM packages
const { QueryTypes } = require('sequelize');

// importing database
const db = require("../../../util/database")

// importing required models for the words and comparisons
const English = require("../../../models/data/english");
const EnglishComparisonConnector = require("../../../models/data/english-comparison-connector");
const EnglishComparison = require("../../../models/data/english-comparison");

const Armenian = require("../../../models/data/armenian");
const ArmenianComparisonConnector = require("../../../models/data/armenian-comparison-connector");
const ArmenianComparison = require("../../../models/data/armenian-comparison");

// --- Setting up and exporting comparison's searching function
exports.searchComparison = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { wordIds, language } = req.body;

    try {
      // Setting parameters depending on comparison language
      const languageSettings =
        language === 0
          ? {
            wordsTable: "armenians",
            comparisonConnectorTable: "armenian_comparison_connectors",
            comparisonTable: "armenian_comparisons",
            comparisonIdColumn: "armenianComparisonId",
            wordIdColumn: "armenianId"
          }
          : {
            wordsTable: "englishes",
            comparisonConnectorTable: "english_comparison_connectors",
            comparisonTable: "english_comparisons",
            comparisonIdColumn: "englishComparisonId",
            wordIdColumn: "englishId"
          }

      let comparisons = { "comparisons": [] };

      await Promise.all(
        wordIds.map(async wordId => {
          const raw = await db.query(
            `
                SELECT 	
                  baseWord.id AS "baseWordId",
                  baseWord.word AS "baseWord",                  
                  otherWord.id AS "otherWordId", 
                  otherWord.word AS "otherWord", 
                  comparison.id AS "comparisonId",
                  comparison.comparison AS "comparisonText"          
                FROM ${languageSettings["comparisonConnectorTable"]} comparisonConnector          
                JOIN ${languageSettings["wordsTable"]} baseWord
                ON baseWord.id = ${wordId}          
                JOIN ${languageSettings["comparisonTable"]} comparison
                ON comparison.id = comparisonConnector.${languageSettings["comparisonIdColumn"]}          
                JOIN ${languageSettings["wordsTable"]} otherWord
                ON comparisonConnector.${languageSettings["wordIdColumn"]} = otherWord.id          
                WHERE 
                  comparisonConnector.${languageSettings["comparisonIdColumn"]} 
                    IN
                      (SELECT ${languageSettings["comparisonIdColumn"]}
                      FROM ${languageSettings["comparisonConnectorTable"]} comparisonConnector1
                      WHERE comparisonConnector1.${languageSettings["wordIdColumn"]} = ${wordId})
              `,
            { type: QueryTypes.SELECT })

          if (raw.length !== 0) {
            const baseWord = { "value": raw[0]["baseWordId"], "label": raw[0]["baseWord"] }

            const comparisonsPerWord = []
            raw.forEach(element => {
              if (!(comparisonsPerWord.filter(x => x["value"] === element["comparisonId"]).length > 0)) {
                comparisonsPerWord.push({ "value": element["comparisonId"], "label": element["comparisonText"] })
              }
            });

            const comparisonsAndRelatedWordsPerEachWord = []
            for (let i = 0; i < comparisonsPerWord.length; i++) {
              comparisonsAndRelatedWordsPerEachWord.push({ "comparison": comparisonsPerWord[i], "relatedWords": [] })
              for (let j = 0; j < raw.length; j++) {
                if (comparisonsPerWord[i]["value"] === raw[j]["comparisonId"]) {
                  comparisonsAndRelatedWordsPerEachWord[i]["relatedWords"].push({ "value": raw[j]["otherWordId"], "label": raw[j]["otherWord"] })
                }
              }
            }

            let result = {}

            result["baseWord"] = baseWord
            result["comparisonsPerWord"] = comparisonsAndRelatedWordsPerEachWord

            comparisons["comparisons"].push(result)
          }
        }))

      res.send(comparisons)
    }

    catch (error) {
      throw "Wrong definitions!";
    }
  }

  catch (error) {
    // If there was another error - send status 500
    return res.status(500).send("Something else broke!");
  }
};
