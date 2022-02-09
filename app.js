// --- Importing required packages
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");

// --- Establishing connection with the database, importing the models and setting their relationships
// database import
const db = require("./util/database");

// user related models import
const User = require("./models/user");
const Login = require("./models/login");
const Token = require("./models/token");

// translation related models import
const English = require("./models/english");
const Armenian = require("./models/armenian");
const Translation = require("./models/translation");
const PartOfSpeech = require("./models/pos");
const Example = require("./models/example");
const FieldConnector = require("./models/field-connector");
const Field = require("./models/field");

// models relationships setting
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

Translation.belongsTo(PartOfSpeech);
PartOfSpeech.hasMany(Translation);

Translation.hasMany(Example, {
  onDelete: "CASCADE",
  foreignKey: { allowNull: false },
  hooks: true,
});
Example.belongsTo(Translation);

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
  origin: "https://modul-dictionary.herokuapp.com",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use this after the variable declaration

// connecting with routes
const routes = require("./routes/routes");
app.use("/", routes);

// --- Syncing models with the database and listening the server
// db.sync({ force: true })
db.sync()
  .then(() => {
    app.listen(process.env.PORT || 3000);
    console.log(`App is running at ${process.env.PORT || 3000}!`);
  })
  .catch((error) => {
    console.log(error);
  });
