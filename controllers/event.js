const db = require('../models');
const util = require('../util/util.js');

module.exports.createEvent = (req, res) => {
	db.Event.create(req.body)
	.then(event => {
		util.print('Event \'' + event.name + '\' created');
		res.redirect('/calendar');
	}, err => {
		util.error(req, res, err);
	});
};
