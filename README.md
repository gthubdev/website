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
PORT=3000
IP=localhost 

# For MariaDB
DBHost=DATABASE_HOST
DBName=DATABASE_NAME
DBUser=DATABASE_USER
DBPass=DATABASE_PASSWORD
```
You can use the supplied `.env.sample` as a base.

* Test your database connection with:
`npm run test_connection`

* Create the tables with:
`npm run create_tables`

* Insert testdata with:
`npm run insert_testdata`

* Run:
`npm start`

## Testing
* Run:
`npm test`
