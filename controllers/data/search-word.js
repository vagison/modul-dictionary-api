// --- Importing required packages

// importing ORM packages
const { Op, col } = require("sequelize");

// importing required models for the words and translations
const English = require("../../models/english");
const Armenian = require("../../models/armenian");
const Translation = require("../../models/translation");

// importing RegExp constrains
const { armChars, engChars, numChars, skipChars } = require("../../util/regexp");

// --- Setting up and exporting word searching function
exports.searchWord = async (req, res, next) => {
  try {
    // Getting the input from the request
    const { searchedWord } = req.body;
    console.log(1)
    // Empty word handling
    if (!searchedWord) {
      return res.status(500).send("Nothing searched!");
    }
    console.log(2)

    // Setting up direction and picking correct language based on the searched word
    var direction;
    try {
      if (typeof searchedWord === "string" && armChars.test(searchedWord[0])) {
        direction = 0;
      } 
      else if (typeof searchedWord === "string" && engChars.test(searchedWord[0])) {
        direction = 1;
      } 
      else if (typeof searchedWord === "string" && numChars.test(searchedWord[0])) {
        direction = 100;
      } 
      else {
        throw "Wrong language!";
      }
    } 
    catch (error) {
      // If there was a problem with reading the language - send status 500 and the error 
      return res.status(500).send(error);
    }
    console.log(3)


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
        var allWords = await language.findAll({
          where: {
            [Op.or]: [
              {
                word: {
                  [Op.like]: `${filter}%`,
                },
              },
              {
                word: {
                  [Op.like]: `% ${filter}%`,
                },
              },
            ],
          },
          order: [["word", "ASC"]],
          raw: true,
        });

        return(allWords)
      }

      // Words picker function (for the languages)
      async function wordsPicker(direction, word) {
        var words = [];
        
        // Setting language table
        var languageTable = await tableSetter(direction);

        if (direction === 0 || direction === 1) {
          words = await tableTraverser(languageTable, word);
        }
        else if (direction === 100) {
          var englishWords = [];
          var armenianWords = [];
  
          englishWords = await tableTraverser(English, word);
          armenianWords = await tableTraverser(Armenian, word);
  
          words = englishWords.concat(armenianWords);
        }
        return words
      }

      // Words appender function
      async function wordsAppender(words, collection) {
        var index = 0;
        var wordsToAppend = [];

        // Grouping words (lower-upper)
        if (words.length >= 6) {
          while (index < words.length - 1) {
            var appendedWord = {};
            var appendedWordIds = [];

            appendedWord["type"] = "word";
            if (
              words[index]["word"].toLowerCase() ===
              words[index + 1]["word"].toLowerCase()
            ) {
              appendedWord["label"] = words[index]["word"].toLowerCase();
              appendedWordIds.push(words[index]["id"]);
              appendedWordIds.push(words[index + 1]["id"]);
              index = index + 2;
            } else {
              appendedWord["label"] = words[index]["word"];
              appendedWordIds.push(words[index]["id"]);
              index = index + 1;
            }
            appendedWord["ids"] = appendedWordIds;

            wordsToAppend.push(appendedWord);
          }
        } 
        else {
          while (index < words.length) {
            var appendedWord = {};
            var appendedWordIds = [];

            appendedWord["type"] = "word";
            if (
              index !== words.length - 1 &&
              words[index]["word"].toLowerCase() ===
                words[index + 1]["word"].toLowerCase()
            ) {
              appendedWord["label"] = words[index]["word"].toLowerCase();
              appendedWordIds.push(words[index]["id"]);
              appendedWordIds.push(words[index + 1]["id"]);
              index = index + 2;
            } else {
              appendedWord["label"] = words[index]["word"];
              appendedWordIds.push(words[index]["id"]);
              index = index + 1;
            }

            appendedWord["ids"] = appendedWordIds;

            wordsToAppend.push(appendedWord);
          }
        }

        // Sorting first by word then alphabetically function
        async function transformWordsArray(allWords, filteringWord) {
          var first = [];
          var others = [];
      
          for (var i = 0; i < allWords.length; i++) {
            if (allWords[i]["label"].indexOf(filteringWord) == 0) {
              first.push(allWords[i]);
            } else {
              others.push(allWords[i]);
            }
          }
      
          first.sort();
          others.sort();
      
          return first.concat(others).slice(0, 5);
        };

        // Sorting first by word then alphabetically
        wordsToAppend = await transformWordsArray(wordsToAppend, searchedWord)

        // Appending sorted words to the collection
        wordsToAppend.forEach(t => collection.push(t))
      }

      // Getting necessary words
      const words = await wordsPicker(direction, searchedWord)

      // Appending words to the collection
      await wordsAppender(words, collection)
      return collection
    }

    // Abbreviations appending function
    async function appendAbbreviationsToCollection(searchedWord, direction, collection) {
      // Corresponding language params setter function
      async function languageParamsSetter(direction) {
        if (direction === 0) {
          return {abbreviationLanguage: "abbreviationArm", wordLanguage: "armenianId", charsLanguage: armChars};
        } 
        else if (direction === 1) {
          return {abbreviationLanguage: "abbreviationEng", wordLanguage: "englishId", charsLanguage: engChars};
        } 
        else {
          return "";
        }
      }
      
      // Appropriate filter creater function
      async function regExpCreator(word, charsLanguage, skipChars) {
        // setting RegExp
        var abbreviationRegExp = "((^";
        for (var i = 0; i < word.length - 1; i++) {
          if (
            charsLanguage.test(word[i]) || numChars.test(word[i])
          ) 
          {
            abbreviationRegExp = abbreviationRegExp.concat(
              `[${word[i].toLowerCase()}]${skipChars}*)(`
            );
          }
        }

        !(charsLanguage.test(word[i]) || numChars.test(word[i]))
          ? (abbreviationRegExp = abbreviationRegExp.concat(")$)"))
          : (abbreviationRegExp = abbreviationRegExp.concat(
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
            [abbreviationLanguage]: { [Op.regexp]: filter },
          },
          raw: true,
        });

        var abbreviationsCollection = []
        if (abbreviationsRaw.length !== 0) {
          var abbreviationsObject = {};

          abbreviationsRaw.forEach((abbreviation) => {
            abbreviationsObject[abbreviation[abbreviationLanguage]]
              ? abbreviationsObject[abbreviation[abbreviationLanguage]].push(
                  abbreviation[wordLanguage]
                )
              : (abbreviationsObject[abbreviation[abbreviationLanguage]] = [
                  abbreviation[wordLanguage],
                ]);
          });

          for (let abbreviation in abbreviationsObject) {
            var eachAbbreviation = {};
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
          var languageParams = await languageParamsSetter(direction);
          var charsLanguage = languageParams["charsLanguage"];
          var abbreviationLanguage = languageParams["abbreviationLanguage"];
          var wordLanguage = languageParams["wordLanguage"];

          var filter = await regExpCreator(searchedWord, charsLanguage, skipChars);

          var abbreviations = await abbreviationsPicker(filter, abbreviationLanguage, wordLanguage)

          abbreviations.forEach(abbreviation => collection.push(abbreviation))

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
      collection = await abbreviationsAppender(searchedWord, direction, collection)
      return collection
    }

    // Appended words and abbreviations appending to response function
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

    // Calling functions to append words, abbreviations and the corresponding direction to the response
    try {
      // Creating a collection of words and abbreviations
      var wordsAndAbbreviationsCollection = [];
      console.log(4)

      
      // Appending words to the collection
      wordsAndAbbreviationsCollection = await appendWordsToCollection(searchedWord, direction, wordsAndAbbreviationsCollection);
      console.log(5)
      // Appending abbreviations to the collection
      wordsAndAbbreviationsCollection = await appendAbbreviationsToCollection(searchedWord, direction, wordsAndAbbreviationsCollection);
      console.log(6)
      // Creating a response object from the collection of words and abbreviations and the direction
      var response = {};
      console.log(7)
      // Appending the collection to the response
      response = await appendCollectionToResponse(
        wordsAndAbbreviationsCollection,
        response
      );
      console.log(8)

      // Appending the direction to the response
      response = await appendDirectionToResponse(direction, response);
      console.log(9)

      // Sending the response
      return res.status(200).send(response);
    } 
    
    // Sending error as incorrect word selected
    catch (error) {
      console.log(error)
      return res.status(500).send("Wrong word searched!");
    }
  } 
  
  catch (error) {
    return res.status(500).send("Something else broke!");
  }
};
