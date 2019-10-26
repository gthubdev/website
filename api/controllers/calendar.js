const db = require('../models/');
const Sequelize = require('sequelize');
const dateutil = require('../util/dateutil');
const util = require('../util/util');

const DEFAULT_TIMEZONE = 'Europe/Stockholm';

module.exports.getCalendar = (req, res) => {
	let timezone = req.cookies.timezone !== undefined ? req.cookies.timezone : DEFAULT_TIMEZONE;
	res.clearCookie('timezone', { httpOnly: true });
	buildCalendar(req, res, timezone);
};

module.exports.getCalendarWithTimezone = (req, res) => {
	res.cookie('timezone', req.body.timezone, { httpOnly: true });
	res.redirect('/calendar');
};

async function buildCalendar(req, res, timezone) {
	try {
		const [ events, series, tracks, vehicleclasscategories, vehicleclasses ] = await Sequelize.Promise.all([
			db.Event.findAll({
				include: [
					{ model: db.Track },
					{ model: db.Series },
					{
						model: db.SupportSeries,
						include: [
							{ model: db.Series }
						]
					},
					{
						model: db.EventSession,
						include: [
							{ model: db.Series }
						]
					}
				],
				order: [
					['priority', 'ASC'],
					['startdate', 'ASC'],
					[db.EventSession, 'starttime', 'ASC']
				]
			}),
			db.Series.findAll({
				include: [
					{
						model: db.SeriesType,
						include: [
							{
								model: db.VehicleClass,
								include: [
									{ model: db.VehicleClassCategory }
								]
							}
						]
					}
				],
				order: [
					['priority', 'ASC'],
					['name', 'ASC']
				]
			}),
			db.Track.findAll({
				order: [
					['name', 'ASC']
				]
			}),
			db.VehicleClassCategory.findAll({
				include: [
					{ model: db.VehicleClass }
				],
				order: [
					['name', 'ASC'],
				]
			}),
			db.VehicleClass.findAll({
				include: [
					{ model: db.VehicleClassCategory }
				],
				order: [
					['name', 'ASC']
				]
			})
		]);

		// timezone-info
		let tz = {
			tz_strings: dateutil.tz_strings,
			tz_array: dateutil.tz_array,
			tz_offsets: dateutil.tz_offsets,
			timezone: timezone // client-timezone
		};

		let data = {
			events: events,
			series: series,
			tracks: tracks,
			vehicleclasscategories: vehicleclasscategories,
			vehicleclasses: vehicleclasses,
			tz: tz
		};

		res.json(data);
	} catch(err) {
		util.error(req, res, err);
	}
}
