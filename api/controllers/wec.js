const https = require('https');

module.exports.getWecData = (req, res) => {
	https.get('https://storage.googleapis.com/fiawec-prod/assets/live/WEC/__data.json', response => {
		let data = '';

		// A chunk of data has been recieved
		response.on('data', chunk => {
			data += chunk;
		});

		// The whole response has been received
		response.on('end', () => {
			res.json({
				data: JSON.parse(data)
			});
		});
	}, err => {
		console.log(err);
	});
};
