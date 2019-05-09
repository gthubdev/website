const db = require('../models/');
const Sequelize = require('sequelize');
const dateutil = require('../util/dateutil.js');

const DEFAULT_TIMEZONE = 'Europe/Brussels';

module.exports.getCalendar = (req, res) => {
	let timezone = req.cookies.timezone !== undefined ? req.cookies.timezone : DEFAULT_TIMEZONE;
	res.clearCookie('timezone', { httpOnly: true });
	buildCalendar(req, res, timezone);
};

module.exports.getCalendarWithTimezone = (req, res) => {
	res.cookie('timezone', req.body.timezone, { httpOnly: true });
	res.redirect('/calendar');
};

function buildCalendar(req, res, timezone) {
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
				tz_offsets: dateutil.tz_offsets,
				timezone: timezone
			});
	}, err => {
		util.error(req, res, err);
	});
}
