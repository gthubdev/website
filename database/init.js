const fs = require('fs');
const path = require('path');
const db = require('../api/models/');

// set the delay in milliseconds
const delay = 1000;

console.log('Initializing data...');
setTimeout(() => {
	// eslint-disable-next-line no-path-concat
	fs.readFile(path.join(__dirname, '/init_data.sql'), async (err, data) => {
		if (err)
			throw err;

		try {
			await db.sequelize.query(data.toString());
			console.log('Initializing data completed.');
			process.exit(0);
		} catch (error) {
			console.log(error);
			console.log('Error initializing data.');
			process.exit(1);
		}
	});
}, delay);
