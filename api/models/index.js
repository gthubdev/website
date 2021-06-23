/*
	Using Sequelize as ORM framework
*/

const fs = require('fs');
const path = require('path');
const env = require('dotenv');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(module.filename);
const db = {};

// loads .env variables
env.config();

let dbconfig;
if (sameDatabase()) {
	console.error('Trying to use the same database for production and test.');
	process.exit(1);
} else if (process.env.NODE_ENV !== 'test' && prodDbVarsSet()) { // production/dev + config found
	dbconfig = {
		host: process.env.DBHost,
		databasename: process.env.DBName,
		user: process.env.DBUser,
		password: process.env.DBPass,
		port: process.env.DBPort
	};
} else if (process.env.NODE_ENV === 'test' && testDbVarsSet() === true) { // test + config found
	dbconfig = {
		host: process.env.TestDBHost,
		databasename: process.env.TestDBName,
		user: process.env.TestDBUser,
		password: process.env.TestDBPass,
		port: process.env.TestDBPort
	};
} else if (process.env.NODE_ENV !== 'test') { // production/dev but no config found
	console.error('No database credentials found in .env');
	process.exit(1);
} else { // test but no config (used for CircleCI
	console.log('CIRCLECI');
	dbconfig = require('../../database/circleci.js');
}

// Define database-configuration
const sequelize = new Sequelize(dbconfig.databasename, dbconfig.user, dbconfig.password, {
	host: dbconfig.host,
	port: dbconfig.port,
	dialect: 'mariadb',
	logging: false,
	dialectOptions: {
		multipleStatements: true,
		timezone: 'local'
	},
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	}
});

// Test the connection
testConnection();

// Load all the models
fs
	.readdirSync(__dirname)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const model = require(path.join(__dirname, file))(sequelize, DataTypes);
		db[model.name] = model;
	});

// Create the foreign keys
Object.keys(db).forEach(model => {
	if (db[model].associate)
		db[model].associate(db);
});

// Create tables, if necessary
sequelize.sync();

// Delete all tokens
deleteTokens();

// Export the db Object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

async function deleteTokens() {
	await db.Auth.destroy({
		where: {}
	});
}

async function testConnection() {
	try {
		await sequelize.authenticate();
	} catch (err) {
		console.error('Unable to connect to the database');
		process.exit(1);
	}
}

function prodDbVarsSet() {
	return process.env.DBHost !== '' &&
		process.env.DBName !== '' &&
		process.env.DBUser !== '' &&
		process.env.DBPass !== '' &&
		!isNaN(Number.parseInt(process.env.DBPort));
}

function testDbVarsSet() {
	return process.env.TestDBHost !== '' &&
		process.env.TestDBName !== '' &&
		process.env.TestDBUser !== '' &&
		process.env.TestDBPass !== '' &&
		!isNaN(Number.parseInt(process.env.TestDBPort));
}

function sameDatabase() {
	return prodDbVarsSet() && testDbVarsSet() &&
		process.env.DBHost === process.env.TestDBHost &&
		process.env.DBName === process.env.TestDBName &&
		process.env.DBPort === process.env.TestDBPort;
}
