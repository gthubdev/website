const db = require('../api/models/');
const fs = require('fs');

// set the delay in milliseconds
let delay = 1000;

console.log('Inserting testdata...');
setTimeout(() => {
	fs.readFile(__dirname + '/testdata.sql', async (err, data) => {
		if (err) {
			throw err;
		}

		try {
			await db.sequelize.query(data.toString());
			console.log('Inserting testdata completed.');
			process.exit(0);
		} catch(error) {
			console.log(error);
			console.log('Error inserting testdata.');
			process.exit(1);
		}
	});
}, delay);
