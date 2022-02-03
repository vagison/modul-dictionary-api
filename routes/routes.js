// --- Importing required packages
// importing express and the router
const express = require("express");
const router = express.Router();

// importing authentication checker
const authChecker = require("../util/auth-check");

// importing controllers
// user
// const registerController = require("../controllers/user/register");
const signinController = require("../controllers/user/signin");
const signoutController = require("../controllers/user/signout");
// data-getting
const searchWordController = require("../controllers/data/search-word");
const searchPOSController = require("../controllers/data/search-pos");
const searchFieldController = require("../controllers/data/search-field");
const searchTranslationController = require("../controllers/data/search-translation");
// data-modifying
const registerTranslationController = require("../controllers/data/register-translation");
const updateTranslationController = require("../controllers/data/update-translation");
const deleteTranslationController = require("../controllers/data/delete-translation");

// --- Authorization required routes
// /delete-translation, /register-translation, /update-translation, /signout => POST
router.post(
  [
    "/delete-translation",
    "/register-translation",
    "/update-translation",
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

// --- Exporting the router
module.exports = router;
