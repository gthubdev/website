const db = require('../models');
const util = require('../util/util.js');
const countryList = require('country-list');
const moment = require('moment-timezone');

module.exports.createTrack = async (req, res) => {
	if (countryList.getCode(req.body.track.country) === undefined) {
		res.status(400).send('Invalid country');
		return;
	}

	if (!moment.tz.zone(req.body.track.timezone)) {
		res.status(400).send('Invalid timezone');
		return;
	}

	try {
		const track = await db.Track.create(req.body.track);
		util.print('Track \'' + track.name + '\' created');
		res.json(track.get({plain:true}));
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.updateTrack = async (req, res) => {
	if (req.body.track.country && countryList.getCode(req.body.track.country) === undefined) {
		res.status(400).send('Invalid country');
		return;
	}

	if (req.body.track.timezone && !moment.tz.zone(req.body.track.timezone)) {
		res.status(400).send('Invalid timezone');
		return;
	}

	try {
		const response = await db.Track.update(req.body.track,
			{ where: { id: req.params.id }
		});
		if (response[0] >= 1)
			util.print('Tracks updated: ' + response[0]);
		res.json({ updated: response[0] });
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.deleteTrack = async (req, res) => {
	// A track cannot be deleted, if it is used in an event
	try {
		const response = await db.Track.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('Tracks deleted: ' + response);
		res.json({ deleted: response });
	} catch(err) {
		// Errno 1451 is when trying to delete a row which is referenced
		// from another entity and 'On Delete' is set to 'RESTRICT'
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The track is used in events.');
		else
			util.error(req, res, err);
	}
};
