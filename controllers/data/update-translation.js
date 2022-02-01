// --- Importing required packages

// importing ORM packages
const sequelize = require("sequelize");
const { Op } = require("sequelize");

// importing the database and the required models for the words and translations
const db = require("../../util/database");
const English = require("../../models/english");
const Armenian = require("../../models/armenian");
const Translation = require("../../models/translation");
const Example = require("../../models/example");
const FieldConnector = require("../../models/field-connector");

// importing RegExp constrains
const { armChars, engChars, numChars } = require("../../util/regexp");

// importing unused words deleting function
const deleteUnusedWords = require("../../util/delete-unused-words");

// --- Setting up translation's updating function
exports.updateTranslation = async (req, res, next) => {
  try {
    // Getting the input from the request
    const {
      translationId,
      oldEnglishWordId,
      oldArmenianWordId,
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
    } = req.body;

    // User wrong input handling, including wrong values (as possible) and datatypes
    {
      if (!translationId || typeof translationId !== "number") {
        return res.status(500).send("Wrong data sent!");
      }
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

    // Establishing transaction
    const transaction = await db.transaction();
    try {
      // Finding or creating english word for the translation
      const [englishWordRetrieved, crEng] = await English.findOrCreate({
        where: {
          word: sequelize.where(
            sequelize.literal("BINARY word ="),
            `'${englishWord}'`,
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

      // Searching for another translation with same english, armenian words and part of speech
      const existingTranslation = await Translation.findOne({
        where: {
          englishId: englishWordId,
          armenianId: armenianWordId,
          posId: pos ? pos : 1,
        },
        raw: true,
      });

      // If the translation exists and not the current one - throw an error!
      if (
        existingTranslation !== null &&
        existingTranslation["id"] !== translationId
      ) {
        throw "Translation already exists!";
      }

      // Updating the translation
      await Translation.update(
        // Values to update
        {
          englishId: englishWordId,
          armenianId: armenianWordId,
          posId: pos ? pos : 1,
          qualityEngArm: !qualityEngArm ? 10 : qualityEngArm,
          qualityArmEng: !qualityArmEng ? 10 : qualityArmEng,
          pronunciation: pronunciation ? pronunciation : null,
          abbreviationEng: abbreviationEng ? abbreviationEng : null,
          abbreviationArm: abbreviationArm ? abbreviationArm : null,
        },
        {
          // Clause
          where: {
            id: translationId,
          },
          // Transaction
          transaction: transaction,
        }
      );

      // Updating field connectors for the updated translation
      if (fields) {
        try {
          await FieldConnector.destroy({
            where: {
              translationId: { [Op.like]: translationId },
            },
            transaction: transaction,
          });

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

      // Updating examples for the updated translation
      if (examples) {
        try {
          await Example.destroy({
            where: {
              translationId: { [Op.like]: translationId },
            },
            transaction: transaction,
          });

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

      // Unused words handling
      await deleteUnusedWords(
        translationId,
        englishWordId === oldEnglishWordId ? null : oldEnglishWordId,
        armenianWordId === oldArmenianWordId ? null : oldArmenianWordId,
        transaction
      );

      // Commiting changes
      await transaction.commit();

      // Sending status for successfully registered translation
      return res.status(200).send("Translation updated succesfully!");
    } 
    catch (error) {
      // If an error occured during the translation updation - roll back the changes
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
