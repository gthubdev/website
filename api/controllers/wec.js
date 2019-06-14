const https = require('https');

let data = '';

module.exports.getWecData = (req, res) => {
	// console.log('RECEIVED REQUEST AT ' + new Date());
	res.json({
		data: data
	});
};

setInterval(() => {
	fetchData()
}, 30 * 1000);

fetchData = function() {
	https.get('https://storage.googleapis.com/fiawec-prod/assets/live/WEC/__data.json', response => {
		let tmp = '';

		// A chunk of data has been recieved
		response.on('data', chunk => {
			tmp += chunk;
		});

		// The whole response has been received
		response.on('end', () => {
			data = JSON.parse(tmp);
			// console.log('UPDATE FROM SOURCE AT ' + new Date());
		});
	}, err => {
		console.log(err);
	});
};

fetchData();
