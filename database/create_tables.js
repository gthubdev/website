const db = require('../api/models/');

// set the delay in milliseconds
const delay = 1000;

console.log('Recreating tables...');
setTimeout(async () => {
	try {
		await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
		await db.sequelize.sync({ force: true });
		await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
		console.log('Recreating tables completed.');
		process.exit(0);
	} catch (err) {
		console.log(err);
		console.log('Error syncing database.');
		process.exit(1);
	}
}, delay);
