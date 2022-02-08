# Modul Technical Dictionary API
Final project for the API of Modul Technical Dictionary (English-Armenian / Armenian-English technical dictionary)

## About the project
This English-Armenian / Armenian-English technical dictionary includes more than 5000 entries (including: words, phrases and abbreviations) that are widely used in various technical fields.

## About requirements for the project
1. The DBMS used for the project is MySQL. You need to install it if don't currently have it
2. Use your credentials to connect to the database and then create a scheme with the name `modul-dict`

## To run this project:
1. Clone this repo
2. From the root folder of this project remove `app.js` file, rename `app-local.js` file into `app.js`
3. From `util` folder of this project remove `database.js` file, rename `database-local.js` file into `database.js`
4. Change the content of `database.js` file according to your credentials in order to connect to the desired database where you have already created `modul-dict` scheme (read project requirements above)
5. From `data` folder of this project import the tables into `modul-dict` scheme
6. Run `npm install`
7. Run `npm start`