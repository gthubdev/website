# GTHub Website

This repo purpose its to host the source code for the [GTHub](https://gthub.eu) website.

## Requirements

* [Node.js](https://nodejs.org) - (Need Node.js >= 8)
* [MariaDB](https://mariadb.org/)

## Installation

* Clone this repo with:
`git clone https://github.com/gthubdev/website`

* Install dependencies:
`npm install`

* Create the file `.env` and enter your configuration:
```
# Web server
# Defaults to 3000 if not set
PORT=3000
# Defaults to 127.0.0.1 if not set
IP=localhost

# MariaDB
DBHost=DATABASE_HOST
DBName=DATABASE_NAME
DBUser=DATABASE_USER
DBPass=DATABASE_PASSWORD
# Defaults to 3306 if not set (MariaDB default)
DBPort=3306

# Authentication
# Set it to some random key
JWT_KEY=ChooseSomeRandomKeyHere
```
You can use the supplied `.env.sample` as a base.

* Test your database connection with:
`npm run test_connection`

* Create the tables with:
`npm run create_tables`

* Initialize data with:
`npm run init_data`<br>
You can now login with `admin / admin`.

* [Optional] Insert testdata with:
`npm run insert_testdata`

## Run
* To run in development mode: `npm run dev`
* To run in production mode: `npm run build` to generate all files followed by `npm start` to start the server

## Testing
* Run:
`npm test`
