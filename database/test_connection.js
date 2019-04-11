const Sequelize = require('sequelize');
const dbconfig 	= require('../database/config.js');

// Define database-configuration
const sequelize = new Sequelize(dbconfig.databasename, dbconfig.user, dbconfig.password, {
  host: dbconfig.host,
  dialect: 'postgres',
  logging: false
});

// Test connection
sequelize
	.authenticate()
	.then(() => {
		console.log('Connection to the database has been established successfully.');
		process.exit(0);
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err);
		process.exit(1);
	});
