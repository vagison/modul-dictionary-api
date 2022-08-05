// --- Importing required packages

// importing ORM packages
const { Op } = require("sequelize");

// importing required models for the words and translations
const English = require("../../../models/data/english");
const Armenian = require("../../../models/data/armenian");
const Translation = require("../../../models/data/translation");
const PartOfSpeech = require("../../../models/data/pos");
const Example = require("../../../models/data/example");
const Definition = require("../../../models/data/definition");
const Field = require("../../../models/data/field");
const FieldConnector = require("../../../models/data/field-connector");

// importing RegExp
const regexp = require("../../../util/regexp");

// importing Exceptions
const exceptions = require("../../../util/exceptions.js");

// --- Setting up and exporting translation's searching function
exports.searchTranslation = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { direction, selectedWord } = req.body;

    // If the direction is wrong or selected word is empty
    if ((direction !== 0 && direction !== 1) || !selectedWord) {
      return res.send("Wrong direction or no word selected!");
    }

    // Searching translations
    else {
      try {
        // Language parameters setter function
        async function languageParamsSetter(direction) {
          let params = {};

          if (direction === 0) {
            params = {
              languageTableFrom: Armenian,
              languageTableTo: English,
              quality: "qualityArmEng",
              armenianWordId: "id",
              englishWordId: "translations.english.id",
              armenianWordColumnName: "word",
              englishWordColumnName: "translations.english.word",
              exceptionsList: exceptions.armenianExceptions,
            };
          } else if (direction === 1) {
            params = {
              languageTableFrom: English,
              languageTableTo: Armenian,
              quality: "qualityEngArm",
              armenianWordId: "translations.armenian.id",
              englishWordId: "id",
              armenianWordColumnName: "translations.armenian.word",
              englishWordColumnName: "word",
              exceptionsList: exceptions.englishExceptions,
            };
          }
          return params;
        }

        // Searching parameters setter function
        async function searchingCriteriasSetter(word) {
          let finalCriteria = {};
          if (word["type"] === "abbreviation") {
            finalCriteria = {
              id: { [Op.in]: word["value"] },
            };
          }

          if (word["type"] === "word") {
            // picking all the words of the searched phrase, replacing escape characters with a space, then making it an array of strings
            let allWordsOfThePhrase = word["label"]
              .replaceAll(new RegExp(regexp.skipChars, "gm"), " ")
              .split(" ");

            // filtering the array from duplications
            allWordsOfThePhrase = [...new Set(allWordsOfThePhrase)];

            // cleaning the array from the exceptions, saving into another array and then rewriting the back
            let tmp = [];
            for (let i = 0; i < allWordsOfThePhrase.length; i++) {
              if (
                !exceptionsList.includes(allWordsOfThePhrase[i].toLowerCase())
              ) {
                tmp.push(allWordsOfThePhrase[i]);
              }
            }
            allWordsOfThePhrase = tmp;

            // creating a criteria for querying the words
            let allCriterias = [];
            for (i = 0; i < allWordsOfThePhrase.length; i++) {
              allCriterias.push({
                word: {
                  [Op.like]: `${allWordsOfThePhrase[i]}%`,
                },
              });
              allCriterias.push({
                word: {
                  [Op.like]: `% ${allWordsOfThePhrase[i]}%`,
                },
              });
              allCriterias.push({
                word: {
                  [Op.like]: `%-${allWordsOfThePhrase[i]}%`,
                },
              });
              allCriterias.push({
                word: {
                  [Op.like]: `%/${allWordsOfThePhrase[i]}%`,
                },
              });
            }
            finalCriteria = {
              [Op.or]: allCriterias,
            };
          }
          return finalCriteria;
        }

        // Translations picker function
        async function translationsFinder(criteria) {
          return await languageTableFrom.findAll({
            where: criteria,
            include: {
              model: Translation,
              required: true,
              include: [
                {
                  model: languageTableTo,
                },
                PartOfSpeech,
              ],
            },
            order: [
              [Translation, PartOfSpeech, "id", "ASC"],
              // ["word", "ASC"],
              [Translation, quality, "DESC"],
            ],
            raw: true,
          });
        }

        // Picked translations processing function
        async function translationsProcesser(allTranslations) {
          // stringyfing allTranslations and making back JSON
          let jsonString = JSON.stringify(allTranslations);
          let obj = JSON.parse(jsonString);
          return obj;
        }

        // Picked translations id's extracting function
        async function translationsIdsPicker(allTranslations) {
          const translationsIds = allTranslations.map(
            (translation) => translation["translations.id"]
          );
          return translationsIds;
        }

        // Picked translations related fields selecting function
        async function fieldConnectorsPicker(translationsIds) {
          return await FieldConnector.findAll({
            where: {
              translationId: { [Op.in]: translationsIds },
            },
            attributes: ["translationId"],
            include: {
              model: Field,
              attributes: ["id", "field"],
            },
            raw: true,
          });
        }

        // Picked translations related examples selecting function
        async function examplesPicker(translationsIds) {
          return await Example.findAll({
            where: {
              translationId: { [Op.in]: translationsIds },
            },
            attributes: ["translationId", "englishExample", "armenianExample"],
            raw: true,
          });
        }

        // Picked translations related definitions selecting function
        async function definitionsPicker(translationsIds) {
          return await Definition.findAll({
            where: {
              translationId: { [Op.in]: translationsIds },
            },
            attributes: [
              "translationId",
              "englishDefinition",
              "armenianDefinition",
            ],
            raw: true,
          });
        }

        // Response object maker function
        async function responseMaker(
          processedTranslations,
          allFields,
          allExamples,
          allDefinitions,
          word
        ) {
          let translations = [];
          let type = word["type"];

          processedTranslations.forEach((item) => {
            let eachTranslation = {};
            eachTranslation["translationId"] = item["translations.id"];
            eachTranslation["englishWordId"] = item[englishWordId];
            eachTranslation["armenianWordId"] = item[armenianWordId];
            eachTranslation["englishWord"] = item[englishWordColumnName];
            eachTranslation["armenianWord"] = item[armenianWordColumnName];
            eachTranslation["pos"] = {
              label: item["translations.pos.pos"],
              value: item["translations.pos.id"],
            };
            eachTranslation["qualityEngArm"] =
              item["translations.qualityEngArm"];
            eachTranslation["qualityArmEng"] =
              item["translations.qualityArmEng"];

            if (item["translations.pronunciation"]) {
              eachTranslation["pronunciation"] =
                item["translations.pronunciation"];
            }

            if (item["translations.abbreviationEng"]) {
              eachTranslation["abbreviationEng"] =
                item["translations.abbreviationEng"];
            }

            if (item["translations.abbreviationArm"]) {
              eachTranslation["abbreviationArm"] =
                item["translations.abbreviationArm"];
            }

            if (allFields.length !== 0) {
              let fields = allFields.filter(
                (field) =>
                  field["translationId"] === eachTranslation["translationId"]
              );

              if (fields.length !== 0) {
                let sentFields = [];

                fields.forEach((field) => {
                  let eachField = {};
                  eachField["label"] = field["field.field"];
                  eachField["value"] = field["field.id"];
                  sentFields.push(eachField);
                });

                eachTranslation["fields"] = sentFields;
              }
            }

            if (allExamples.length !== 0) {
              let examples = allExamples.filter(
                (example) =>
                  example["translationId"] === eachTranslation["translationId"]
              );
              if (examples.length !== 0) {
                examples.forEach((e) => delete e.translationId);
                eachTranslation["examples"] = examples;
              }
            }

            if (allDefinitions.length !== 0) {
              let definitions = allDefinitions.filter(
                (definition) =>
                  definition["translationId"] ===
                  eachTranslation["translationId"]
              );
              if (definitions.length !== 0) {
                definitions.forEach((d) => delete d.translationId);
                eachTranslation["definitions"] = definitions;
              }
            }

            translations.push(eachTranslation);
          });

          let response = {};
          response["translations"] = translations;
          response["type"] = type;

          return response;
        }

        // Starting the process

        // Defining language parameters
        const {
          languageTableFrom,
          languageTableTo,
          quality,
          armenianWordId,
          englishWordId,
          armenianWordColumnName,
          englishWordColumnName,
          exceptionsList,
        } = await languageParamsSetter(direction);

        // Defining searching parameters
        const criteriaParams = await searchingCriteriasSetter(selectedWord);

        // Searching for the translations
        const allTranslations = await translationsFinder(criteriaParams);

        // Processing the translations
        const processedTranslations = await translationsProcesser(
          allTranslations
        );

        // Picking the id's of the translations
        const translationsIds = await translationsIdsPicker(allTranslations);

        // Picking related fields for the translations
        const allFields = await fieldConnectorsPicker(translationsIds);

        // Picking related examples for the translations
        const allExamples = await examplesPicker(translationsIds);

        // Picking related definitions for the translations
        const allDefinitions = await definitionsPicker(translationsIds);

        // Making the response object
        const response = await responseMaker(
          processedTranslations,
          allFields,
          allExamples,
          allDefinitions,
          selectedWord
        );

        // Sending the response object
        if (response) {
          // Sending successfully found translations and the status code
          return res.status(200).send(response);
        } else {
          // If there was no translation - send status 500
          return res.status(500).send("Nothing found to sent!");
        }
      } catch (error) {
        // Sending error if the data was still incorrect
        return res.status(500).send("Wrong data to find translations!");
      }
    }
  } catch (error) {
    // If there was another error - send status 500
    return res.status(500).send("Something else broke!");
  }
};
