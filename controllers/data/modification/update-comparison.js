// importing the database and the required models for the words and comparisons
const db = require("../../../util/database");
const EnglishComparisonConnector = require("../../../models/data/english-comparison-connector");
const EnglishComparison = require("../../../models/data/english-comparison");
const ArmenianComparisonConnector = require("../../../models/data/armenian-comparison-connector");
const ArmenianComparison = require("../../../models/data/armenian-comparison");

// --- Setting up and exporting word searching function
exports.updateComparison = async (req, res, next) => {
    try {
        // Getting the input from the request
        const { language, comparisonId, comparisonText, words } = req.body;

        // User wrong input handling
        if (comparisonText.length === 0 || typeof (comparisonText) !== "string") {
            throw "Wrong comparison text entered!";
        }

        if (words.length === 0) {
            throw "No words selected!";
        }

        if (language !== 0 && language !== 1 || typeof (language) !== "number") {
            throw "Wrong language selected!";
        }


        // Searching required comparison by id
        if (typeof comparisonId === "number") {
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

            const comparison = await languageSettings["ComparisonTable"].findOne({
                where: {
                    id: comparisonId,
                },
            });

            // If comparison found
            if (comparison !== null) {
                // Establishing transaction
                const transaction = await db.transaction();

                try {
                    // Removing the instance of existing comparison
                    await comparison.destroy({ transaction: transaction });

                    // Creating new comparison
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

                    // Commiting changes
                    await transaction.commit();

                    // Sending status for successfully updated comparison
                    return res.status(200).send("Comparison updated!");
                }
                catch {
                    // If an error occured during updating the comparison - roll back the changes
                    await transaction.rollback();

                    // Throw an error for unsuccessfull deletion
                    throw "Something went wrong during transaction!";
                }
            }

            // If comparison not found
            else {
                // Throw an error as comparison not found
                throw "No comparison found!";
            }
        }

        // Incorrect data to find a comparison
        else {
            // Throw an error as there was a wrong data to find a comparison
            throw "Wrong comparison data selected!";
        }
    }

    catch (error) {
        if (error === "Wrong comparison text entered!"
            || error === "No words selected!"
            || error === "Wrong language selected!"
            || error === "Something went wrong during transaction!"
            || error === "No comparison found!"
            || error === "Wrong comparison data selected!") {
            return res.status(500).send(error);
        }

        // If there was another error - send status 500
        return res.status(500).send("Something else broke!");
    }
};
