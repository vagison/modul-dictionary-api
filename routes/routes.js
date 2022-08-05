// --- Importing required packages
// importing express and the router
const express = require("express");
const router = express.Router();

// importing authentication checker
const authChecker = require("../util/auth-check");

// --- Establishing the controllers
// user actions
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

// --- Establishing the routes
// authorization required routes
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
// user registration, signin and signout routes
// router.post("/register", registerController.register);
router.post("/signin", signinController.signin);
router.post("/signout", signoutController.signout);
// searching routes
router.post("/search-pos", searchPOSController.searchPOS);
router.post("/search-field", searchFieldController.searchField);
router.post("/search-word", searchWordController.searchWord);
router.post(
  "/search-translation",
  searchTranslationController.searchTranslation
);
router.post("/search-comparison", searchComparisonController.searchComparison);
// translation registering, updating and deleting routes
router.post(
  "/register-translation",
  registerTranslationController.registerTranslation
);
router.post(
  "/update-translation",
  updateTranslationController.updateTranslation
);
router.post(
  "/delete-translation",
  deleteTranslationController.deleteTranslation
);
// comparison registering, updating and deleting routes
router.post(
  "/register-comparison",
  registerComparisonController.registerComparison
);
router.post("/update-comparison", updateComparisonController.updateComparison);
router.post("/delete-comparison", deleteComparisonController.deleteComparison);

// --- Exporting the router
module.exports = router;
