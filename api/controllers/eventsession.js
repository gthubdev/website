const { Event, EventSession, Series } = require('../models');
const util = require('../util/util');
const moment = require('moment-timezone');

module.exports.createEventSession = async (req, res) => {
	moment.suppressDeprecationWarnings = true;
	let starttime = moment(req.body.session.starttime);
	if (!starttime.isValid()) {
		res.status(400).send('Invalid starttime');
		return;
	}

	let duration = req.body.session.duration;
	if (duration <= 0) {
		res.status(400).send('Invalid duration');
		return;
	}

	// need to convert the local starttime into UTC
	req.body.session.starttime = getLocalTime(req.body.session);

	try {
		// check for a start/end outside the event's dates
		const event = await Event.findOne({
			where: {id: req.body.session.event}
		});
		const ev_startdate = event.startdate;
		const ev_enddate = event.enddate;

		if (moment(ev_startdate).isAfter(starttime.format('YYYY-MM-DD'))) {
			res.status(400).send('Session is outside event-dates');
			return;
		}

		if (moment(ev_enddate).isBefore(starttime.format('YYYY-MM-DD'))) {
			res.status(400).send('Session is outside event-dates');
			return;
		}

		// create
		const newsession = await EventSession.create(req.body.session);
		// query the newly created session to include series-info
		const eventsession = await EventSession.findOne({
			where: {id: newsession.id},
			include : [
				{ model: Series }
			]
		});
		util.print('EventSession \'' + eventsession.name + '\' created');
		res.json(eventsession.get({plain:true}));
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.updateEventSession = async (req, res) => {
	moment.suppressDeprecationWarnings = true;

	if (!req.body.session || !req.body.session.timezone) {
		res.status(400).send('Bad request');
		return;
	}

	let starttime;
	if (req.body.session.starttime) {
		starttime = moment(req.body.session.starttime);
		if (starttime && !starttime.isValid()) {
			res.status(400).send('Invalid starttime');
			return;
		}
	}

	if (req.body.session.duration) {
		let duration = req.body.session.duration;
		if (duration <= 0) {
			res.status(400).send('Invalid duration');
			return;
		}
	}

	// need to convert the local starttime into UTC
	req.body.session.starttime = getLocalTime(req.body.session);

	try {
		// check for a start/end outside the event's dates
		const tmpsession = await EventSession.findOne({
			where: {id: req.body.session.id},
			include: [
				{ model: Event }
			]
		});
		const event = await Event.findOne({
			where: {id: tmpsession.Event.id}
		});
		let ev_startdate = event.startdate;
		let ev_enddate = event.enddate;

		if (moment(ev_startdate).isAfter(starttime.format('YYYY-MM-DD'))) {
			res.status(400).send('Session is outside event-dates');
			return;
		}

		if (moment(ev_enddate).isBefore(starttime.format('YYYY-MM-DD'))) {
			res.status(400).send('Session is outside event-dates');
			return;
		}

		// update
		const response = await EventSession.update(req.body.session,
			{ where: { id: req.params.id } }
		);
		if (response[0] === 0)
			return;

		util.print(response[0] + ' EventSession updated');

		const session = await EventSession.findOne({
			where: { id: req.params.id },
			include: [
				{ model: Series }
			]
		});
		res.json(session.get({plain:true}));
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.deleteEventSession = async (req, res) => {
	try {
		const response = await EventSession.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('EventSessions deleted: ' + response);
		res.json({ deleted: response });
	} catch(err) {
		util.error(req, res, err);
	}
};

function getLocalTime(session) {
	let oldstart = moment.utc(session.starttime);

	let zone = moment.tz.zone(session.timezone);
	let offset = zone.parse(Date.UTC(
		oldstart.get('year'),
		oldstart.get('month'),
		oldstart.get('date'),
		oldstart.get('hour'),
		oldstart.get('minute')));

	let newstart = moment(oldstart).add(offset, 'm');

	return newstart.format();
}
