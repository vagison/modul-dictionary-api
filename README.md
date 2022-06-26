# Modul Technical Dictionary API
Final API project for the Modul Technical Dictionary (English-Armenian / Armenian-English technical dictionary)

## About the project
This English-Armenian / Armenian-English technical dictionary includes more than 5000 entries (including: words, phrases and abbreviations) that are widely used in various technical fields.

## About requirements for the project
1. The DBMS used for the project is MySQL. You need to install it if don't have it yet
2. Use your credentials to connect to the database and create a scheme with the name `modul-dict`

## To run this project:
1. Clone this repo
2. Update `database.js` file in accordance with your credentials in order to connect to the desired database where you have already created `modul-dict` scheme (read project requirements above)
3. Import the tables into `modul-dict` scheme from `data` folder of the repo
4. Run `npm install`
5. Run `npm start`
