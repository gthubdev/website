const db = require('../models');
const util = require('../util/util.js');

module.exports.createTrack = (req, res) => {
	db.Track.create(req.body)
	.then(track => {
		util.print('Track \'' + track.name + '\' created');
		res.redirect('/calendar');
	}, err => {
		util.error(req, res, err);
	});
};
