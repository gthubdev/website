/*
	Using Sequelize as ORM framework
*/

/*jslint node: true */
'use strict';

const fs        = require('fs');
const path      = require('path');
const Sequelize = require('sequelize');
const basename  = path.basename(module.filename);
const db        = {};
const dbconfig 	= require('../database/config.js');

// Define database-configuration
const sequelize = new Sequelize(dbconfig.databasename, dbconfig.user, dbconfig.password, {
	host: dbconfig.host,
	dialect: 'mariadb',
	logging: false,
	dialectOptions: {
		multipleStatements: true
	},
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	timezone: 'Europe/Amsterdam'
});

//Load all the models
fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		let model = sequelize['import'](path.join(__dirname, file));
		db[model.name] = model;
	});

// Create the foreign keys
Object.keys(db).forEach(model => {
	if (db[model].associate) {
		db[model].associate(db);
	}
});

// Create tables, if necessary
sequelize.sync();

// Export the db Object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
