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

* Create the file `database/config.js` and enter your database credentials:
```
/*jslint node: true */
'use strict';
// TODO: adjust
const db = {
	host: 'DATABASE_HOST',
	databasename: 'DATABASE_NAME',
	user: 'DATABASE_USER',
	password: 'DATABASE_PASSWORD'
};
module.exports = db;
```

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
