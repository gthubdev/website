const { Event, EventSession } = require('../models/');
const dateutil = require('../util/dateutil');
const util = require('../util/util');
const include_options = require('../util/include_options');

module.exports.getCalendar = async (req, res) => {
	try {
		const events = await Event.findAll({
			attributes: ['id', 'name', 'priority', 'logo', 'startdate', 'enddate', 'track_id', 'mainseries_id'],
			include: include_options.event,
			order: [
				['priority', 'ASC'],
				['startdate', 'ASC'],
				[EventSession, 'starttime', 'ASC']
			]
		});

		const data = {
			events: events.map(e => e.get({ plain: true })),
			timezones: dateutil.timezones
		};

		res.json(data);
	} catch (err) {
		util.error(req, res, err);
	}
};
