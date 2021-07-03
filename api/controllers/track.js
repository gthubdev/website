const countryList = require('country-list');
const { Track } = require('../models');
const util = require('../util/util');
const dateutil = require('../util/dateutil');

module.exports.find = async (req, res) => {
	const tracks = await Track.findAll({
		order: [
			['id', 'ASC']
		]
	});
	return res.json(tracks);
};

module.exports.createTrack = async (req, res) => {
	if (countryList.getCode(req.body.track.country) === undefined) {
		res.status(422).send('Invalid country');
		return;
	}

	if (!isValidTimezone(req.body.track.timezone)) {
		res.status(422).send('Invalid timezone');
		return;
	}

	try {
		const track = await Track.create(req.body.track);
		util.print('Track \'' + track.name + '\' created');
		res.json(track.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.updateTrack = async (req, res) => {
	if (req.body.track.country && countryList.getCode(req.body.track.country) === undefined) {
		res.status(422).send('Invalid country');
		return;
	}

	if (req.body.track.timezone && !isValidTimezone(req.body.track.timezone)) {
		res.status(422).send('Invalid timezone');
		return;
	}

	try {
		const response = await Track.update(req.body.track,
			{ where: { id: req.params.id } }
		);
		if (response[0] >= 1)
			util.print('Tracks updated: ' + response[0]);
		res.json({ updated: response[0] });
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.deleteTrack = async (req, res) => {
	// A track cannot be deleted, if it is used in an event
	try {
		const response = await Track.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('Tracks deleted: ' + response);
		res.json({ deleted: response });
	} catch (err) {
		// Errno 1451 is when trying to delete a row which is referenced
		// from another entity and 'On Delete' is set to 'RESTRICT'
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The track is used in events.');
		else
			util.error(req, res, err);
	}
};

function isValidTimezone(timezone) {
	for (let i = 0; i < dateutil.timezones.length; i++)
		if (dateutil.timezones[i].name === timezone) return true;

	return false;
}
