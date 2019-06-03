require('dotenv').config();
const Sequelize = require('sequelize');

// Define database-configuration
const sequelize = new Sequelize(process.env.DBName, process.env.DBUser, process.env.DBPass, {
	host: process.env.DBHost,
	dialect: 'mariadb',
	logging: false,
		dialectOptions: {
		multipleStatements: true,
		timezone: 'local'
	}
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
