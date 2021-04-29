const { Event, EventSession, Track, Series, SupportSeries } = require('../models/');
const dateutil = require('../util/dateutil');
const util = require('../util/util');

module.exports.getCalendar = async (req, res) => {
	try {
		const events = await Event.findAll({
			include: [
				{ model: Track },
				{ model: Series },
				{
					model: SupportSeries,
					include: [
						{ model: Series }
					]
				},
				{
					model: EventSession,
					include: [
						{ model: Series }
					]
				}
			],
			order: [
				['priority', 'ASC'],
				['startdate', 'ASC'],
				[EventSession, 'starttime', 'ASC']
			]
		});

		const data = {
			events,
			timezones: dateutil.timezones
		};

		res.json(data);
	} catch (err) {
		util.error(req, res, err);
	}
};
