const { Event, SupportSeries, Track, Series, EventSession } = require('../models');
const Sequelize = require('sequelize');
const util = require('../util/util.js');
const moment = require('moment');

module.exports.createEvent = async (req, res) => {
	moment.suppressDeprecationWarnings = true;
	let startdate = moment(req.body.event.startdate);
	let enddate = moment(req.body.event.enddate);

	if (!startdate.isValid() || !enddate.isValid()) {
		res.status(400).send('Invalid dates');
		return;
	}

	if (startdate.isAfter(enddate.format('YYYY-MM-DD'))) {
		res.status(400).send('Enddate cannot be before startdate');
		return;
	}

	let prio = req.body.event.priority;
	if (prio < 1 || prio > 4) {
		res.status(400).send('Invalid priority');
		return;
	}

	try {
		const newevent = await Event.create(req.body.event);

		// build the array with the event.id for the support series
		let supportarray = [];
		req.body.event.supportseries.forEach(s => {
			supportarray.push({
				event: newevent.id,
				series: s.id
			});
		});
		await SupportSeries.bulkCreate(supportarray);

		const event = await Event.findOne({
			where: {id: newevent.id},
			include: [
				{ model: Track },
				{ model: Series},
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
		util.print('Event \'' + event.name + '\' created');
		res.json(event.get({plain:true}));
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.updateEvent = async (req, res) => {
	moment.suppressDeprecationWarnings = true;
	if (req.body.event.startdate && req.body.event.enddate) {
		let startdate = moment(req.body.event.startdate);
		let enddate = moment(req.body.event.enddate);

		if (!startdate.isValid() || !enddate.isValid()) {
			res.status(400).send('Invalid dates');
			return;
		}

		if (startdate.isAfter(enddate.format('YYYY-MM-DD'))) {
			res.status(400).send('Enddate cannot be before startdate');
			return;
		}
	} else if (req.body.event.startdate || req.body.event.enddate) {
		res.status(400).send('Must supply both startdate and enddate');
		return;
	}

	if (req.body.event.priority) {
		let prio = req.body.event.priority;
		if (prio < 1 || prio > 4) {
			res.status(400).send('Invalid priority');
			return;
		}
	}

	try {
		const [ updated, deleted ] = await Sequelize.Promise.all([
			Event.update(req.body.event,
				{ where: { id: req.params.id } }
			),
			SupportSeries.destroy({
				where: { event: req.params.id }
			})
		]);
		if (updated !== 1 && deleted < 0) {
			util.error(req, res, 'Error updating event ' + req.body.event.name);
			return;
		}

		// build the array with the event.id for the support series
		let supportarray = [];
		req.body.event.supportseries.forEach(s => {
			supportarray.push({
				event: req.params.id,
				series: s.id
			});
		});
		await SupportSeries.bulkCreate(supportarray);

		const event = await Event.findOne({
			where: {id: req.params.id},
			include: [
				{ model: Track },
				{ model: Series},
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
		res.json(event.get({plain:true}));
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.deleteEvent = async (req, res) => {
	try {
		const response = await Event.destroy({
			where: { id: req.params.id }
		});
		if (response === 1)
			util.print('Deleted Event with id ' + req.params.id);
		res.json({ deleted: response });
	} catch(err) {
		util.error(req, res, err);
	}
};
