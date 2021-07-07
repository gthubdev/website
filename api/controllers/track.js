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

module.exports.findOne = async (req, res) => {
	const track = await Track.findOne({
		where: { id: req.params.id }
	});

	if (!track) return res.status(404).send('No tracks found');

	return res.json(track);
};

module.exports.createTrack = async (req, res) => {
	if (countryList.getCode(req.body.country) === undefined) {
		res.status(422).send('Invalid country');
		return;
	}

	if (!isValidTimezone(req.body.timezone)) {
		res.status(422).send('Invalid timezone');
		return;
	}

	try {
		const track = await Track.create(req.body);
		util.print('Track \'' + track.name + '\' created');
		res.json(track.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.updateTrack = async (req, res) => {
	if (req.body.country && countryList.getCode(req.body.country) === undefined) {
		res.status(422).send('Invalid country');
		return;
	}

	if (req.body.timezone && !isValidTimezone(req.body.timezone)) {
		res.status(422).send('Invalid timezone');
		return;
	}

	try {
		const response = await Track.update(req.body,
			{ where: { id: req.params.id } }
		);
		if (response[0] === 0)
			return;

		util.print('Tracks updated: ' + response[0]);

		const track = await Track.findOne({
			where: { id: req.params.id }
		});
		res.json(track.get({ plain: true }));
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
		if (dateutil.timezones[i].name === timezone)
			return true;

	return false;
}
