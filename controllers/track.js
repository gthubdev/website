const db = require('../models');
const util = require('../util/util.js');

module.exports.createTrack = (req, res) => {
	db.Track.create(req.body)
	.then(track => {
		util.print('Track \'' + track.name + '\' created');
		res.redirect('/calendar');
	}, err => {
		util.print('Ups. Something went wrong trying to create a track.');
		util.print(err);
		res.redirect('/calendar');
	});
};
