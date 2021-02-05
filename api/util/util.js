const dayjs = require('dayjs');

// prints something to the console
// console.log clutters the test-output otherwise
function print(s) {
	if (process.env.NODE_ENV !== 'test')
		console.log(dayjs().format(), s);
}
module.exports.print = print;

// print error & redirect
function error(req, res, err) {
	console.error(err);
	res.status(500).send('Unexpected fire in the car. In case of door emergencies, please call Rob.');
}
module.exports.error = error;
