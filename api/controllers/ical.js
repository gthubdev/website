const db = require('../models');
const ical = require('ical-generator');
const moment = require('moment');
const util = require('../util/util');

module.exports.createIcal = (req, res) => {
	db.Event.findOne({
		where: { id: req.params.id },
		include: [
			{
				model: db.EventSession,
				include: [
					{ model: db.Series }
				]
			},
			{ model: db.Track }
		]
	}).then(event => {
		const cal = ical({
			domain: 'gthub.eu',
			prodId: {company: 'GTHub Inc.', product: 'ical-generator'},
			name: event.name,
			timezone: 'UTC'
		});
		event.EventSessions.forEach(s => {
			cal.createEvent({
				start: moment(s.starttime),
				end: moment(s.starttime).add(s.duration, 'minute'),
				summary: s.Series.shortname + ' (' + s.name + ')',
				location: event.Track.name
			});
		});
		res.json(cal.toString());
	}, err => {
		util.error(req, res, err);
	});
};
