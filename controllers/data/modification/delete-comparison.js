// --- Importing required packages

// importing the database and the translations model
const db = require("../../../util/database");
const ArmenianComparison = require("../../../models/data/armenian-comparison");
const EnglishComparison = require("../../../models/data/english-comparison");

// --- Setting up and exporting translation deleting function
exports.deleteComparison = async (req, res, next) => {
    try {
        // Getting the input from the request
        const { comparisonId, language } = req.body;

        // Searching required comparison by id
        if (typeof comparisonId === "number") {
            const ComparisonTable = language === 0 ? ArmenianComparison : EnglishComparison

            const comparison = await ComparisonTable.findOne({
                where: {
                    id: comparisonId,
                },
            });

            // If comparison found
            if (comparison !== null) {
                // Establishing transaction
                const transaction = await db.transaction();

                try {
                    // Removing the instance of comparison
                    await comparison.destroy({ transaction: transaction });

                    // Commiting changes
                    await transaction.commit();

                    // Sending status for successfully deleted comparison
                    return res.status(200).send("Comparison deleted!");
                }
                catch {
                    // If an error occured during the comparison deletion - roll back the changes
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
        // If there was an error during finding a comparison or it's deletion - send status 500 and the error
        if (
            error === "No comparison found!" ||
            error === "Wrong comparison data selected!" ||
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
