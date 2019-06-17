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

module.exports.deleteTrack = (req, res) => {
	// A track cannot be deleted, if it is used in an event
	db.Track.destroy({
		where: { id: req.params.id }
	}).then(response => {
		if (response >= 1)
			util.print('Tracks deleted: ' + response);
		res.json({ deleted: response });
	}, err => {
		// Errno 1451 is when trying to delete a row which is referenced
		// from another entity and 'On Delete' is set to 'RESTRICT'
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The track is used in events.');
		else
			util.error(req, res, err);
	});
};
