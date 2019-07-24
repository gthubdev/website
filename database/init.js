const db = require('../api/models/');
const fs = require('fs');

// set the delay in milliseconds
let delay = 2000;

console.log('Initializing data...');
setTimeout(() => {
	fs.readFile(__dirname + '/init_data.sql', (err, data) => {
		if (err) {
			throw err;
		}
		db.sequelize.query(data.toString()).then(() => {
			console.log('Initializing data completed.');
			process.exit(0);
		}).catch(err => {
			console.log(err);
			console.log('Error initializing data.');
			process.exit(1);
		});

	});
}, delay);
