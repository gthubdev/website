const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const { Event, EventSession, Series } = require('../models');
const util = require('../util/util');
const datetimeformat = 'YYYY-MM-DD HH:mm';

module.exports.create = async (req, res) => {
	const starttime = dayjs(req.body.starttime);

	if (starttime.format(datetimeformat) !== req.body.starttime) {
		res.status(422).send('Invalid starttime');
		return;
	}

	const duration = req.body.duration;
	if (duration <= 0) {
		res.status(422).send('Invalid duration');
		return;
	}

	const sessiontype = req.body.sessiontype_id || 0;
	if (sessiontype < 1 || sessiontype > 4) {
		res.status(422).send('Invalid sessiontype');
		return;
	}

	// need to convert the local starttime into UTC
	req.body.starttime = convertLocalTimeToUTC(req.body).format();

	try {
		// check for a start/end outside the event's dates
		const event = await Event.findOne({
			where: { id: req.body.event_id }
		});
		const ev_startdate = event.startdate;
		const ev_enddate = event.enddate;

		if (dayjs(ev_startdate).isAfter(starttime, 'day')) {
			res.status(422).send('Session is outside event-dates');
			return;
		}

		if (dayjs(ev_enddate).isBefore(starttime, 'day')) {
			res.status(422).send('Session is outside event-dates');
			return;
		}

		// create
		const newsession = await EventSession.create(req.body);
		// query the newly created session to include series-info
		const eventsession = await EventSession.findOne({
			where: { id: newsession.id },
			include: [
				{ model: Series }
			],
			raw: true,
			nest: true
		});
		util.print('EventSession \'' + eventsession.name + '\' created');
		res.json(eventsession);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body || !req.body.timezone) {
		res.status(422).send('Bad request');
		return;
	}

	let starttime;
	if (req.body.starttime) {
		starttime = dayjs(req.body.starttime);
		if (starttime && starttime.format(datetimeformat) !== req.body.starttime) {
			res.status(422).send('Invalid starttime');
			return;
		}
	}

	if (req.body.duration) {
		const duration = req.body.duration;
		if (duration <= 0) {
			res.status(422).send('Invalid duration');
			return;
		}
	}

	const sessiontype = req.body.sessiontype_id;
	if (sessiontype < 1 || sessiontype > 4) {
		res.status(422).send('Invalid sessiontype');
		return;
	}

	// need to convert the local starttime into UTC
	req.body.starttime = convertLocalTimeToUTC(req.body).format();

	try {
		// check for a start/end outside the event's dates
		const tmpsession = await EventSession.findOne({
			where: { id: req.params.id },
			include: [
				{ model: Event }
			],
			raw: true,
			nest: true
		});
		const event = await Event.findOne({
			where: { id: tmpsession.Event.id }
		});
		const ev_startdate = event.startdate;
		const ev_enddate = event.enddate;

		if (dayjs(ev_startdate).isAfter(starttime, 'day')) {
			res.status(422).send('Session is outside event-dates');
			return;
		}

		if (dayjs(ev_enddate).isBefore(starttime, 'day')) {
			res.status(422).send('Session is outside event-dates');
			return;
		}

		// update
		const response = await EventSession.update(req.body,
			{ where: { id: req.params.id } }
		);
		if (response[0] === 0)
			return;

		util.print(response[0] + ' EventSession updated');

		const session = await EventSession.findOne({
			where: { id: req.params.id },
			include: [
				{ model: Series }
			],
			raw: true,
			nest: true
		});
		res.json(session);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await EventSession.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('EventSessions deleted: ' + response);
		res.json({ deleted: response });
	} catch (err) {
		util.error(req, res, err);
	}
};

function convertLocalTimeToUTC(session) {
	// eslint-disable-next-line no-undef
	dayjs.extend(utc);
	// eslint-disable-next-line no-undef
	dayjs.extend(timezone);

	return dayjs.tz(session.starttime, session.timezone).utc();
}
