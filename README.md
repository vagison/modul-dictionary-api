# Modul Technical Dictionary API
Final project for Modul Technical Dictionary API

## About the project
This English-Armenian / Armenian-English online technical dictionary includes more than 5000 entries (including: words, phrases and abbreviations) that are widely used in various technical fields. The database is created based on our company's years of experience in the field of technical documentation and translation.

## About requirements for the project
1. The DBMS used for the project is MySQL. You need to install it if don't currently have it
2. Use your credentials to connect to the database and then create a scheme with the name `modul-dict`

## To run this project:
1. Clone this repo
2. Change the `database.js` file with your credentials to connect to the desired database where you have already created `modul-dict` scheme
3. Import the data into selected scheme from `data` folder of this project
4. Run `npm install`
5. Run `npm start`
