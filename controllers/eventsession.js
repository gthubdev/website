const db = require('../models');
const util = require('../util/util.js');

module.exports.createEventSession = (req, res) => {
	db.EventSession.create(req.body)
	.then(eventsession => {
		util.print('EventSession \'' + eventsession.name + '\' created');
		res.redirect('/calendar');
	}, err => {
		util.error(req, res, err);
	});
};
