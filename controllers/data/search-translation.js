// --- Importing required packages

// importing ORM packages
const { Op } = require("sequelize");

// importing required models for the words and translations
const English = require("../../models/english");
const Armenian = require("../../models/armenian");
const Translation = require("../../models/translation");
const PartOfSpeech = require("../../models/pos");
const Example = require("../../models/example");
const Field = require("../../models/field");
const FieldConnector = require("../../models/field-connector");

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
          var params = {};

          if (direction === 0) {
            params = {
              languageTableFrom: Armenian,
              languageTableTo: English,
              quality: "qualityArmEng",
              armenianWordId: "id",
              englishWordId: "translations.english.id",
              armenianWordColumnName: "word",
              englishWordColumnName: "translations.english.word",
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
            };
          }
          return params;
        }

        // Searching parameters setter function
        async function searchingCriteriasSetter(word) {
          var params = {};
          if (word["type"] === "abbreviation") {
            params = {
              id: { [Op.in]: word["value"] },
            };
          }

          if (word["type"] === "word") {
            params = {
              [Op.or]: [
                {
                  word: {
                    [Op.like]: `${word["label"]}`,
                  },
                },
                {
                  word: {
                    [Op.like]: `${word["label"]} %`,
                  },
                },
                {
                  word: {
                    [Op.like]: `${word["label"]}-%`,
                  },
                },
                {
                  word: {
                    [Op.like]: `% ${word["label"]}`,
                  },
                },
                {
                  word: {
                    [Op.like]: `%-${word["label"]}`,
                  },
                },
                {
                  word: {
                    [Op.like]: `% ${word["label"]} %`,
                  },
                },
                {
                  word: {
                    [Op.like]: `%-${word["label"]} %`,
                  },
                },
                {
                  word: {
                    [Op.like]: `% ${word["label"]}-%`,
                  },
                },
                {
                  word: {
                    [Op.like]: `%-${word["label"]}-%`,
                  },
                },
              ],
            };
          }
          return params;
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
              ["word", "ASC"],
              [Translation, quality, "DESC"],
            ],
            raw: true,
          });
        }

        // Picked translations processing function
        async function translationsProcesser(allTranslations) {
          // stringyfing allTranslations and making back JSON
          var jsonString = JSON.stringify(allTranslations);
          var obj = JSON.parse(jsonString);
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

        // Response object maker function
        async function responseMaker(
          processedTranslations,
          allFields,
          allExamples,
          word
        ) {
          var translations = [];
          var type = word["type"];

          processedTranslations.forEach((item) => {
            var eachTranslation = {};
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
              var fields = allFields.filter(
                (field) =>
                  field["translationId"] === eachTranslation["translationId"]
              );

              if (fields.length !== 0) {
                var sentFields = [];

                fields.forEach((field) => {
                  var eachField = {};
                  eachField["label"] = field["field.field"];
                  eachField["value"] = field["field.id"];
                  sentFields.push(eachField);
                });

                eachTranslation["fields"] = sentFields;
              }
            }

            if (allExamples.length !== 0) {
              var examples = allExamples.filter(
                (example) =>
                  example["translationId"] === eachTranslation["translationId"]
              );
              if (examples.length !== 0) {
                examples.forEach((e) => delete e.translationId);
                eachTranslation["examples"] = examples;
              }
            }

            translations.push(eachTranslation);
          });

          var response = {};
          response["translations"] = translations;
          response["type"] = type;

          return response;
        }

        // Defining language parameters
        const {
          languageTableFrom,
          languageTableTo,
          quality,
          armenianWordId,
          englishWordId,
          armenianWordColumnName,
          englishWordColumnName,
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

        // Making the response object
        const response = await responseMaker(
          processedTranslations,
          allFields,
          allExamples,
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
  } 
  
  catch (error) {
    // If there was another error - send status 500
    return res.status(500).send("Something else broke!");
  }
};
