const db = require('../models');
const util = require('../util/util.js');

module.exports.createTrack = (req, res) => {
	db.Track.create(req.body.track)
	.then(track => {
		util.print('Track \'' + track.name + '\' created');
		res.json(track.get({plain:true}));
	}, err => {
		util.error(req, res, err);
	});
};
