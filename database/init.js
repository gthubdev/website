const db = require('../api/models/');
const fs = require('fs');

// set the delay in milliseconds
let delay = 1000;

console.log('Initializing data...');
setTimeout(() => {
	fs.readFile(__dirname + '/init_data.sql', async (err, data) => {
		if (err)
			throw err;

		try {
			await db.sequelize.query(data.toString());
			console.log('Initializing data completed.');
			process.exit(0);
		} catch(error) {
			console.log(error);
			console.log('Error initializing data.');
			process.exit(1);
		}
	});
}, delay);
