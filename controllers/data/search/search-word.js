// --- Importing required packages

// importing ORM packages
const { Op } = require("sequelize");
const sequelize = require("sequelize")

// importing required models for the words and translations
const English = require("../../../models/data/english");
const Armenian = require("../../../models/data/armenian");
const Translation = require("../../../models/data/translation");

// importing RegExp constrains
const { armChars, engChars, numChars, skipChars } = require("../../../util/regexp");

// --- Setting up and exporting word searching function
exports.searchWord = async (req, res, next) => {
    try {
        // Getting the input from the request
        const { searchedWord } = req.body;
        let { language } = req.body;

        // Empty word handling
        if (!searchedWord) {
            return res.status(200).send({ "collection": [] });
        }

        // Setting up direction and picking correct language based on the searched word or preselected language
        let direction
        try {
            if (language !== 0 && language !== 1) {
                if (typeof searchedWord === "string" && armChars.test(searchedWord[0])) {
                    direction = 0;
                } else if (typeof searchedWord === "string" && engChars.test(searchedWord[0])) {
                    direction = 1;
                } else if (typeof searchedWord === "string" && numChars.test(searchedWord[0])) {
                    direction = 100;
                } else {
                    throw "Wrong language!";
                }
            }
            else if (typeof (language) === "number" && (language === 0 || language === 1)) {
                direction = language
            }
            else {
                throw "Wrong language!";
            }
        }
        catch (error) {
            // If there was a problem with reading the language - send status 500 and the error 
            return res.status(500).send(error);
        }

        // Functions registration
        // Words appending function
        async function appendWordsToCollection(searchedWord, direction, collection) {
            // Correct language table setter function
            async function tableSetter(direction) {
                if (direction === 0) {
                    return Armenian;
                } else if (direction === 1) {
                    return English;
                } else {
                    return "";
                }
            }

            // Table traverser function (for a language)
            async function tableTraverser(language, filter) {
                let allWords = await language.findAll({
                    where: {
                        [Op.or]: [{
                            word: {
                                [Op.like]: `${filter}%`,
                            },
                        },
                        {
                            word: {
                                [Op.like]: `% ${filter}%`,
                            },
                        },
                        {
                            word: {
                                [Op.like]: `%-${filter}%`,
                            },
                        },
                        ],
                    },
                    order: [
                        [
                            sequelize.literal(`CASE WHEN word LIKE '${filter}%' THEN 1 ELSE 2 END`),
                            'ASC'
                        ],
                        ["word", "ASC"],
                    ],
                    raw: true,
                    limit: 5
                });

                return (allWords)
            }

            // Necessary words picker function (for the language/languages)
            async function wordsPicker(direction, word) {
                let words = [];

                // Setting language table
                let languageTable = await tableSetter(direction);

                if (direction === 0 || direction === 1) {
                    words = await tableTraverser(languageTable, word);
                } else if (direction === 100) {
                    let englishWords = [];
                    let armenianWords = [];

                    englishWords = await tableTraverser(English, word);
                    armenianWords = await tableTraverser(Armenian, word);

                    words = englishWords.concat(armenianWords);
                }

                return words
            }

            // Necessary words to the collection appender function
            async function wordsAppender(words, collection) {
                // Grouping words (lower-upper) function
                async function groupWords(words) {
                    let index = 0;
                    let wordsToAppend = [];

                    while (index < words.length) {
                        let appendedWord = {};
                        let appendedWordIds = [];

                        appendedWord["type"] = "word";
                        appendedWord["label"] = words[index]["word"];
                        appendedWordIds.push(words[index]["id"]);
                        appendedWord["ids"] = appendedWordIds;

                        wordsToAppend.push(appendedWord);

                        index = index + 1;
                    }

                    return wordsToAppend
                }

                // Sorting first by exact word then rest alphabetically function
                async function transformWordsArray(allWords, filteringWord) {
                    let exact = [];
                    let rest = [];

                    for (let i = 0; i < allWords.length; i++) {
                        if (allWords[i]["label"].toLowerCase().indexOf(filteringWord) == 0) {
                            exact.push(allWords[i]);
                        } else {
                            rest.push(allWords[i]);
                        }
                    }

                    exact.sort();
                    rest.sort();

                    return exact.concat(rest);
                };

                // Appending sorted words to the collection function
                async function appendWords(wordsToAppend, collection) {
                    wordsToAppend.forEach(word => collection.push(word))
                }

                // Grouping words
                const groupedWords = await groupWords(words)

                // Sorting first by word then alphabetically
                const sortedWords = await transformWordsArray(groupedWords, searchedWord)

                // Appending sorted words to the collection
                await appendWords(sortedWords, collection)
            }

            // Picking necessary words
            const necessaryWords = await wordsPicker(direction, searchedWord)

            // Appending necessary words to the collection
            await wordsAppender(necessaryWords, collection)

            // Returning updated collection
            return collection
        }
        // Abbreviations appending function
        async function appendAbbreviationsToCollection(searchedWord, direction, collection) {
            // Corresponding language params setter function
            async function languageParamsSetter(direction) {
                if (direction === 0) {
                    return { abbreviationLanguage: "abbreviationArm", wordLanguage: "armenianId", charsLanguage: armChars };
                } else if (direction === 1) {
                    return { abbreviationLanguage: "abbreviationEng", wordLanguage: "englishId", charsLanguage: engChars };
                } else {
                    return "";
                }
            }

            // Appropriate filter creater function
            async function regExpCreator(word, charsLanguage, skipChars) {
                // setting RegExp
                let abbreviationRegExp = "((^";
                let i = 0
                for (i; i < word.length - 1; i++) {
                    if (
                        charsLanguage.test(word[i]) || numChars.test(word[i])
                    ) {
                        abbreviationRegExp = abbreviationRegExp.concat(
                            `[${word[i].toLowerCase()}]${skipChars}*)(`
                        );
                    }
                }

                !(charsLanguage.test(word[i]) || numChars.test(word[i])) ?
                    (abbreviationRegExp = abbreviationRegExp.concat(")$)")) :
                    (abbreviationRegExp = abbreviationRegExp.concat(
                        `[${word[
                            word.length - 1
                        ].toLowerCase()}]${skipChars}*)$)`
                    ));
                return abbreviationRegExp
            }

            // Abbreviations picker function
            async function abbreviationsPicker(filter, abbreviationLanguage, wordLanguage) {
                const abbreviationsRaw = await Translation.findAll({
                    where: {
                        [abbreviationLanguage]: {
                            [Op.regexp]: filter
                        },
                    },
                    raw: true,
                });

                let abbreviationsCollection = []
                if (abbreviationsRaw.length !== 0) {
                    let abbreviationsObject = {};

                    abbreviationsRaw.forEach((abbreviation) => {
                        abbreviationsObject[abbreviation[abbreviationLanguage]] ?
                            abbreviationsObject[abbreviation[abbreviationLanguage]].push(
                                abbreviation[wordLanguage]
                            ) :
                            (abbreviationsObject[abbreviation[abbreviationLanguage]] = [
                                abbreviation[wordLanguage],
                            ]);
                    });

                    for (let abbreviation in abbreviationsObject) {
                        let eachAbbreviation = {};
                        eachAbbreviation["type"] = "abbreviation";
                        eachAbbreviation["label"] = abbreviation;
                        eachAbbreviation["ids"] = abbreviationsObject[abbreviation];
                        abbreviationsCollection.push(eachAbbreviation);
                    }
                }
                return abbreviationsCollection;
            }

            // Abbreviations appender function
            async function abbreviationsAppender(searchedWord, direction, collection) {
                // Abbreviations appender for a language function
                async function eachLanguageAbbreviationsAppender(searchedWord, direction, collection) {
                    // Setting corresponding language params
                    let languageParams = await languageParamsSetter(direction);
                    let charsLanguage = languageParams["charsLanguage"];
                    let abbreviationLanguage = languageParams["abbreviationLanguage"];
                    let wordLanguage = languageParams["wordLanguage"];

                    // Setting appropriate filter
                    let filter = await regExpCreator(searchedWord, charsLanguage, skipChars);

                    // Picking the abbreviations
                    let abbreviations = await abbreviationsPicker(filter, abbreviationLanguage, wordLanguage)

                    // Appending picked abbreviations to the collection
                    abbreviations.forEach(abbreviation => collection.push(abbreviation))

                    // Returning updated collection
                    return collection
                }

                // If needed to search for one specific language
                if (direction === 0 || direction === 1) {
                    collection = await eachLanguageAbbreviationsAppender(searchedWord, direction, collection)
                }

                // If needed to search for both languages (abbreviation starts with a common character, such as number)
                else if (direction === 100) {
                    collection = await eachLanguageAbbreviationsAppender(searchedWord, 0, collection);
                    collection = await eachLanguageAbbreviationsAppender(searchedWord, 1, collection);
                }

                return collection
            }

            // Appending the abbreviations to the collection
            updatedCollection = await abbreviationsAppender(searchedWord, direction, collection)

            // Returning updated collection
            return updatedCollection
        }
        // Words and abbreviations appending to response function
        async function appendCollectionToResponse(
            sentCollection,
            collectionAndDirection
        ) {
            collectionAndDirection["collection"] = sentCollection;
            return collectionAndDirection
        }
        // Direction appending to response function
        async function appendDirectionToResponse(
            direction,
            collectionAndDirection
        ) {
            collectionAndDirection["direction"] = direction;
            return collectionAndDirection
            // collectionAndDirection.push({ direction: direction });
        }

        // Functions calling
        try {
            // Creating an empty collection of words and abbreviations
            let wordsAndAbbreviationsCollection = [];

            // Appending words to the collection
            wordsAndAbbreviationsCollection = await appendWordsToCollection(searchedWord, direction, wordsAndAbbreviationsCollection);

            // Appending abbreviations to the collection
            if (language !== 0 && language !== 1) {
                wordsAndAbbreviationsCollection = await appendAbbreviationsToCollection(searchedWord, direction, wordsAndAbbreviationsCollection);
            }

            // Creating a response object from the collection of words and abbreviations and the direction
            let response = {};

            // Appending the collection to the response
            response = await appendCollectionToResponse(
                wordsAndAbbreviationsCollection,
                response
            );

            // Appending the direction to the response
            response = await appendDirectionToResponse(direction, response);

            // Sending the response
            return res.status(200).send(response);
        }
        catch (error) {
            return res.status(500).send("Wrong word searched!");
        }
    }
    catch (error) {
        return res.status(500).send("Something else broke!");
    }
};