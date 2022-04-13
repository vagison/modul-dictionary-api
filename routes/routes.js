// --- Importing required packages
// importing express and the router
const express = require("express");
const router = express.Router();

// importing authentication checker
const authChecker = require("../util/auth-check");

// controllers
// user
// const registerController = require("../controllers/user/register");
const signinController = require("../controllers/user/signin");
const signoutController = require("../controllers/user/signout");

// data-searching
const searchWordController = require("../controllers/data/search/search-word");
const searchPOSController = require("../controllers/data/search/search-pos");
const searchFieldController = require("../controllers/data/search/search-field");
const searchTranslationController = require("../controllers/data/search/search-translation");
const searchComparisonController = require("../controllers/data/search/search-comparison");

// data-modifying
const registerTranslationController = require("../controllers/data/modification/register-translation");
const updateTranslationController = require("../controllers/data/modification/update-translation");
const deleteTranslationController = require("../controllers/data/modification/delete-translation");

const registerComparisonController = require("../controllers/data/modification/register-comparison");
const updateComparisonController = require("../controllers/data/modification/update-comparison");
const deleteComparisonController = require("../controllers/data/modification/delete-comparison");


// routes
// --- Authorization required routes
// /delete-translation, /register-translation, /update-translation, /signout => POST
router.post(
  [
    "/register-translation",
    "/update-translation",
    "/delete-translation",
    "/register-comparison",
    "/update-comparison",
    "/delete-comparison",
    "/signout",
  ],
  authChecker
);






// --- User registration, signin and signout routes
// /register => POST
// router.post("/register", registerController.register);
// /signin => POST
router.post("/signin", signinController.signin);
// /signout => POST
router.post("/signout", signoutController.signout);





// --- Searching routes
// /search-pos => POST
router.post("/search-pos", searchPOSController.searchPOS);
// /search-fields => POST
router.post("/search-field", searchFieldController.searchField);
// /search-word => POST
router.post("/search-word", searchWordController.searchWord);
// /search-translation => POST
router.post(
  "/search-translation",
  searchTranslationController.searchTranslation
);
// /search-comparison => POST
router.post(
  "/search-comparison",
  searchComparisonController.searchComparison
);





// --- Translation registering, updating and deleting routes
// /register-translation => POST
router.post(
  "/register-translation",
  registerTranslationController.registerTranslation
);
// /update-translation => POST
router.post(
  "/update-translation",
  updateTranslationController.updateTranslation
);
// /delete-translation => POST
router.post(
  "/delete-translation",
  deleteTranslationController.deleteTranslation
);





// --- Comparison registering, updating and deleting routes
// /register-comparison => POST
router.post(
  "/register-comparison",
  registerComparisonController.registerComparison
);
// /update-comparison => POST
router.post(
  "/update-comparison",
  updateComparisonController.updateComparison
);
// /delete-comparison => POST
router.post(
  "/delete-comparison",
  deleteComparisonController.deleteComparison
);




// --- Exporting the router
module.exports = router;
