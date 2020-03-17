const { Event, EventSession, Series, Track } = require('../models');
const ical = require('ical-generator');
const moment = require('moment');
const util = require('../util/util');

module.exports.createIcal = async (req, res) => {
	try {
		const event = await Event.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: EventSession,
					include: [
						{ model: Series }
					]
				},
				{ model: Track }
			]
		});
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
	} catch(err) {
		util.error(req, res, err);
	}
};
