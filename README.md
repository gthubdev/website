# GTHub Website

This repo purpose its to host the source code for the [GTHub](https://gthub.eu) website.

## Requirements

* [Node.js](https://nodejs.org) (>= 12.13.0)
* [MariaDB](https://mariadb.org/)
* [Yarn](https://yarnpkg.com/)

## Installation

* Clone this repo with:
`git clone https://github.com/gthubdev/website`

* Install dependencies:
`yarn install`

* Create the file `.env` and enter your configuration:
```
# Web server
# Defaults to 3000 if not set
PORT=3000
# Defaults to 3001 if not set
TESTPORT=3001
# Defaults to 127.0.0.1 if not set
IP=0.0.0.0


# MariaDB config for production/dev #
DBHost=localhost
DBName=gthub
DBUser=delta
DBPass=delta-one
DBPort=3306

# MariaDB config for testing #
TestDBHost=localhost
TestDBName=gthubtest
TestDBUser=delta
TestDBPass=delta-one
TestDBPort=3306


# Authentication #
JWT_KEY=TheOofCounterIsGreat
```
You can use the supplied `.env.sample` as a base.

* Test your database connection with:
`yarn run test_connection`

* Create the tables with:
`yarn run create_tables`

* Initialize data with:
`yarn run init_data`<br>
You can now login with `admin / admin`.

* [Optional] Insert testdata with:
`yarn run insert_testdata`

## Run
* To run in development mode: `yarn run dev`
* To run in production mode: `yarn run build` to generate all files followed by `yarn start` to start the server

## Testing
* Run: `yarn test`
