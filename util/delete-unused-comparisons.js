// --- Importing required packages

// importing ORM packages
const { QueryTypes } = require('sequelize');

// importing database
const db = require("./database")

// --- Setting up unused words deleting function
async function deleteUnusedComparisons(transaction) {
    // Deleting english comparisons if they exist
    await db.query(
        `
                DELETE 
                FROM english_comparisons ec
                WHERE ec.id NOT IN (
                    SELECT ecc.englishComparisonId
                    FROM english_comparison_connectors ecc
                )
            `,
        { type: QueryTypes.DELETE, transaction: transaction },
    )

    // Deleting armenian comparisons if they exist
    await db.query(
        `
                    DELETE 
                    FROM armenian_comparisons ac
                    WHERE ac.id NOT IN (
                        SELECT acc.armenianComparisonId
                        FROM armenian_comparison_connectors acc
                    )
                `,
        { type: QueryTypes.DELETE, transaction: transaction },
    )
}

// --- Exporting unused words deleting function
module.exports = deleteUnusedComparisons;
