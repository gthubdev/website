# GTHub Website

This repo purpose its to host the source code for the [GTHub](https://gthub.eu) website.

## Requirements

* [Node.js](https://nodejs.org) - (Still need to test versions)
* [MariaDB](https://mariadb.org/)

## Installation

* Clone this repo with:
`git clone https://github.com/gthubdev/website`

* Install dependencies:
`npm install`

* Create the file `.env` and enter your configuration:
```
# For the web server
# Defaults to 3000 if not set
PORT=3000
# Defaults to 127.0.0.1 if not set
IP=localhost

# For MariaDB
DBHost=DATABASE_HOST
DBName=DATABASE_NAME
DBUser=DATABASE_USER
DBPass=DATABASE_PASSWORD
# Defaults to 3306 (MariaDB default)
# Uncomment the following line, if you run MariaDB on a different port
#DBPort=DATABASE_PORT
```
You can use the supplied `.env.sample` as a base.

* Test your database connection with:
`npm run test_connection`

* Create the tables with:
`npm run create_tables`

* Insert testdata with:
`npm run insert_testdata`

## Run
* To run in development mode: `npm run dev`
* To run in production mode: `npm run build` to generate all files followed by `npm start` to start the server

## Testing
* Run:
`npm test`
