// --- Importing required packages

// importing ORM packages
const sequelize = require("sequelize");

// importing the database and the required models for the words and translations
const db = require("../../../util/database");
const English = require("../../../models/data/english");
const Armenian = require("../../../models/data/armenian");
const Translation = require("../../../models/data/translation");
const Example = require("../../../models/data/example");
const Definition = require("../../../models/data/definition");
const FieldConnector = require("../../../models/data/field-connector");

// importing RegExp constrains
const { armChars, engChars, numChars } = require("../../../util/regexp");

// --- Setting up and exporting translation's registration function
exports.registerTranslation = async (req, res, next) => {
  try {
    // Getting the input from the request
    let {
      englishWord,
      armenianWord,
      pos,
      qualityEngArm,
      qualityArmEng,
      pronunciation,
      abbreviationEng,
      abbreviationArm,
      fields,
      examples,
      definitions,
    } = req.body;

    // User wrong input handling, including wrong values (as possible) and datatypes
    {
      if (
        englishWord.length === 0 ||
        !(engChars.test(englishWord[0]) || numChars.test(englishWord[0]))
      ) {
        return res.status(500).send("English word is incorrect!");
      }
      if (
        armenianWord.length === 0 ||
        !(armChars.test(armenianWord[0]) || numChars.test(armenianWord[0]))
      ) {
        return res.status(500).send("Armenian word is incorrect!");
      }
      if (
        qualityEngArm &&
        (typeof qualityEngArm !== "number" ||
          qualityEngArm > 10 ||
          qualityEngArm < 1)
      ) {
        return res.status(500).send("English-Armenian quality is incorrect!");
      }
      if (
        qualityArmEng &&
        (typeof qualityArmEng !== "number" ||
          qualityArmEng > 10 ||
          qualityArmEng < 1)
      ) {
        return res.status(500).send("Armenian-English quality is incorrect!");
      }
      if (
        abbreviationEng &&
        !(
          engChars.test(abbreviationEng[0]) || numChars.test(abbreviationEng[0])
        )
      ) {
        return res.status(500).send("English abbreviation is incorrect!");
      }
      if (
        abbreviationArm &&
        !(
          armChars.test(abbreviationArm[0]) || numChars.test(abbreviationArm[0])
        )
      ) {
        return res.status(500).send("Armenian abbreviation is incorrect!");
      }
    }

    // Registering translation
    // Establishing transaction
    const transaction = await db.transaction();
    try {
      // Finding or creating english word for the translation
      const [englishWordRetrieved, crEng] = await English.findOrCreate({
        where: {
          word: sequelize.where(
            sequelize.literal("BINARY word ="),
            `"${englishWord}"`,
            sequelize.literal("")
          ),
        },
        defaults: {
          word: englishWord,
        },
        transaction: transaction,
      });
      const englishWordId = englishWordRetrieved.id;

      // Finding or creating armenian word for the translation
      const [armenianWordRetrieved, crArm] = await Armenian.findOrCreate({
        where: {
          word: sequelize.where(
            sequelize.literal("BINARY word ="),
            `'${armenianWord}'`,
            sequelize.literal("")
          ),
        },
        defaults: {
          word: armenianWord,
        },
        transaction: transaction,
      });
      const armenianWordId = armenianWordRetrieved.id;

      // Registering translation
      const [translationRetrieved, crTranslation] =
        await Translation.findOrCreate({
          where: {
            englishId: englishWordId,
            armenianId: armenianWordId,
            posId: pos ? pos : 1,
          },
          defaults: {
            englishId: englishWordId,
            armenianId: armenianWordId,
            posId: pos ? pos : 1,
            qualityEngArm: !qualityEngArm ? 10 : qualityEngArm,
            qualityArmEng: !qualityArmEng ? 10 : qualityArmEng,
            pronunciation: pronunciation ? pronunciation : null,
            abbreviationEng: abbreviationEng ? abbreviationEng : null,
            abbreviationArm: abbreviationArm ? abbreviationArm : null,
          },
          transaction: transaction,
        });
      const translationId = translationRetrieved.id;

      // Throwing an error for already existing translation
      if (!crTranslation) {
        throw "Translation already exists!";
      }

      // Registering field connectors for the newely created translation
      if (fields) {
        try {
          await Promise.all(
            fields.map(async (field) => {
              await FieldConnector.findOrCreate({
                where: {
                  translationId: translationId,
                  fieldId: field["value"],
                },
                defaults: {
                  translationId: translationId,
                  fieldId: field["value"],
                },
                transaction: transaction,
              });
            })
          );
        } catch (error) {
          throw "Wrong fields!";
        }
      }

      // Registering examples for the newely created translation
      if (examples) {
        try {
          await Promise.all(
            examples.map(async (example) => {
              if (
                example["englishExample"].length !== 0 ||
                example["armenianExample"].length !== 0
              ) {
                await Example.findOrCreate({
                  where: {
                    englishExample: example["englishExample"],
                    armenianExample: example["armenianExample"],
                    translationId: translationId,
                  },
                  defaults: {
                    englishExample: example["englishExample"],
                    armenianExample: example["armenianExample"],
                    translationId: translationId,
                  },
                  transaction: transaction,
                });
              }
            })
          );
        } catch (error) {
          throw "Wrong examples!";
        }
      }

      // Registering definitions for the newely created translation
      if (definitions) {
        try {
          await Promise.all(
            definitions.map(async (definition) => {
              if (
                definition["englishDefinition"].length !== 0 ||
                definition["armenianDefinition"].length !== 0
              ) {
                await Definition.findOrCreate({
                  where: {
                    englishDefinition: definition["englishDefinition"],
                    armenianDefinition: definition["armenianDefinition"],
                    translationId: translationId,
                  },
                  defaults: {
                    englishDefinition: definition["englishDefinition"],
                    armenianDefinition: definition["armenianDefinition"],
                    translationId: translationId,
                  },
                  transaction: transaction,
                });
              }
            })
          );
        }
        catch (error) {
          throw "Wrong definitions!";
        }
      }

      // Commiting the translation
      await transaction.commit();

      // Sending status for successfully registered translation
      return res.status(200).send("Translation registered succesfully!");
    }
    catch (error) {
      // If an error occured during the translation registraion - roll back the changes
      await transaction.rollback();
      // If the translation already existed - send status 304 and the error
      if (error === "Translation already exists!") {
        return res.status(304).send(error);
      }
      // If the input data was still incorrect - send status 500
      else {
        return res.status(500).send("Wrong data sent!");
      }
    }
  }
  catch (error) {
    // If there was another error - send status 500
    res.status(500).send("Something else broke!");
  }
};
