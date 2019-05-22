const db = require('../api/models/');
const fs = require('fs');

// set the delay in milliseconds
let delay = 2000;

console.log('Inserting testdata...');
setTimeout(() => {
	fs.readFile(__dirname + '/testdata.sql', (err, data) => {
		if (err) {
			throw err;
		}
		db.sequelize.query(data.toString()).then(() => {
			console.log('Inserting testdata completed.');
			process.exit(0);
		}).catch(err => {
			console.log(err);
			console.log('Error inserting testdata.');
			process.exit(1);
		});

	});
}, delay);
