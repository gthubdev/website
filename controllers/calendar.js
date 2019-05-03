const db = require('../models/');
const Sequelize = require('sequelize');
const dateutil = require('../util/dateutil.js');

module.exports.getCalendar = (req, res) => {

	Sequelize.Promise.all([
		db.Event.findAll({
			include: [
				{ model: db.Track },
				{
					model: db.EventSession,
					include: [
						{ model: db.Series }
					]
				}
			],
			order: [
				['startdate', 'ASC'],
				[db.EventSession, 'starttime', 'ASC']
			]
		}),
		db.Series.findAll({
			order: [
				['name', 'ASC']
			]
		}),
		db.Track.findAll({
			order: [
				['name', 'ASC']
			]
		})
	]).spread((events, series, tracks) => {
		res.render('calendar.ejs',
			{
				events: events,
				series: series,
				tracks: tracks,
				tz_strings: dateutil.tz_strings,
				tz_offsets: dateutil.tz_offsets
			});
	}, err => {
		util.error(req, res, err);
	});

};
