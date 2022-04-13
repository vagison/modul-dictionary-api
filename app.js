// --- Importing required packages
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// --- Establishing connection with the database, importing the models and setting their relationships
// database import
const db = require("./util/database");

// user related models import
const User = require("./models/user/user");
const Login = require("./models/user/login");
const Token = require("./models/user/token");

// translation related models import
const English = require("./models/data/english");
const Armenian = require("./models/data/armenian");

const Translation = require("./models/data/translation");

const PartOfSpeech = require("./models/data/pos");

const Definition = require("./models/data/definition");
const Example = require("./models/data/example");

const FieldConnector = require("./models/data/field-connector");
const Field = require("./models/data/field");

const ArmenianComparisonConnector = require("./models/data/armenian-comparison-connector");
const ArmenianComparison = require("./models/data/armenian-comparison");

const EnglishComparisonConnector = require("./models/data/english-comparison-connector");
const EnglishComparison = require("./models/data/english-comparison");

// models relations setting
Translation.belongsTo(English);
English.hasMany(Translation);
English.belongsToMany(Armenian, {
  through: { model: Translation, unique: false },
});

Translation.belongsTo(Armenian);
Armenian.hasMany(Translation);
Armenian.belongsToMany(English, {
  through: { model: Translation, unique: false },
});

//
EnglishComparisonConnector.belongsTo(English);
English.hasMany(EnglishComparisonConnector, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
English.belongsToMany(EnglishComparison, {
  through: { model: EnglishComparisonConnector, unique: false },
});

EnglishComparisonConnector.belongsTo(EnglishComparison);
EnglishComparison.hasMany(EnglishComparisonConnector, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
EnglishComparison.belongsToMany(English, {
  through: { model: EnglishComparisonConnector, unique: false },
});

ArmenianComparisonConnector.belongsTo(Armenian);
Armenian.hasMany(ArmenianComparisonConnector, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
Armenian.belongsToMany(ArmenianComparison, {
  through: { model: ArmenianComparisonConnector, unique: false },
});

ArmenianComparisonConnector.belongsTo(ArmenianComparison);
ArmenianComparison.hasMany(ArmenianComparisonConnector, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
ArmenianComparison.belongsToMany(Armenian, {
  through: { model: ArmenianComparisonConnector, unique: false },
});
// 

Translation.belongsTo(PartOfSpeech);
PartOfSpeech.hasMany(Translation);

Translation.hasMany(Example, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
Example.belongsTo(Translation);

Translation.hasMany(Definition, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
Definition.belongsTo(Translation);

Field.hasMany(FieldConnector, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
FieldConnector.belongsTo(Field);

Translation.hasMany(FieldConnector, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
FieldConnector.belongsTo(Translation);


// --- Creating server and configuring middlewares
// creating server
const app = express();

// configuring cookie parser
app.use(cookieParser());

// configuring body parser
app.use(bodyParser.json());

// configuring CORS
const corsOptions = {
  origin: ["http://modul-dictionary.herokuapp.com", "https://modul-dictionary.herokuapp.com"],
  credentials: true,
  optionSuccessStatus: 200,
  exposedHeaders: ['token', 'token-expiration'],
};
app.use(cors(corsOptions)); // Use this after the variable declaration

// connecting with routes
const routes = require("./routes/routes");
app.use("/", routes);

// --- Syncing models with the database and listening the server
db.sync({ force: true })
// db.sync()
//   .then(() => {
//     app.listen(process.env.PORT || 3000);
//     console.log(`App is running at ${process.env.PORT || 3000}!`);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
