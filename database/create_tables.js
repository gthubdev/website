const db = require('../api/models/');

// set the delay in milliseconds
let delay = 2000;

console.log('Recreating tables...');
setTimeout(() => {
	db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
	.then(() => {
		db.sequelize.sync({force:true})
		.then(() => {
			db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
			.then(() => {
				console.log('Recreating tables completed.');
				process.exit(0);
			}).catch(err => {
				printError(err);
			});
		}).catch(err => {
			printError(err);
		});
	}).catch(err => {
		printError(err);
	});

}, delay);

printError = err => {
	console.log(err);
	console.log('Error syncing database.');
	process.exit(1);
};
