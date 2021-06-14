require('dotenv').config();
const Sequelize = require('sequelize');

let dbconfig;
if (process.env.NODE_ENV !== 'test' && process.env.DBHost) { // production/dev + config found
	dbconfig = {
		host: process.env.DBHost,
		databasename: process.env.DBName,
		user: process.env.DBUser,
		password: process.env.DBPass,
		port: process.env.DBPort
	};
} else if (process.env.NODE_ENV === 'test' && process.env.TestDBHost) { // test + config found
	dbconfig = {
		host: process.env.TestDBHost,
		databasename: process.env.TestDBName,
		user: process.env.TestDBUser,
		password: process.env.TestDBPass,
		port: process.env.TestDBPort
	};
} else {
	console.error('No database credentials found in .env');
	process.exit(1);
}

// Define database-configuration
const sequelize = new Sequelize(dbconfig.databasename, dbconfig.user, dbconfig.password, {
	host: dbconfig.host,
	port: dbconfig.port || 3306,
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
