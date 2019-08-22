const db = require('../models');
const Sequelize = require('sequelize');
const util = require('../util/util.js');
const moment = require('moment');

module.exports.createEvent = (req, res) => {
	moment.suppressDeprecationWarnings = true;
	let startdate = moment(req.body.event.startdate);
	let enddate = moment(req.body.event.enddate);

	if (!startdate.isValid() || !enddate.isValid()) {
		res.status(409).send('Invalid dates');
		return;
	}

	if (startdate.isAfter(enddate.format('YYYY-MM-DD'))) {
		res.status(409).send('Enddate cannot be before startdate');
		return;
	}

	let prio = req.body.event.priority;
	if (prio < 1 || prio > 4) {
		res.status(409).send('Invalid priority');
		return;
	}

	db.Event.create(req.body.event)
	.then(newevent => {
		// build the array with the event.id for the support series
		let supportarray = [];
		req.body.event.supportseries.forEach(s => {
			supportarray.push({
				event: newevent.id,
				series: s.id
			});
		});
		db.SupportSeries.bulkCreate(supportarray)
		.then(() => {
			return db.Event.findOne({
				where: {id: newevent.id},
				include: [
					{ model: db.Track },
					{ model: db.Series},
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
			});
		}).then(event => {
			res.json(event.get({plain:true}));
		}, err => {
			util.error(req, res, err);
		});
	}, err => {
		util.error(req, res, err);
	});
};

module.exports.updateEvent = (req, res) => {
	moment.suppressDeprecationWarnings = true;
	if (req.body.event.startdate && req.body.event.enddate) {
		let startdate = moment(req.body.event.startdate);
		let enddate = moment(req.body.event.enddate);

		if (!startdate.isValid() || !enddate.isValid()) {
			res.status(409).send('Invalid dates');
			return;
		}

		if (startdate.isAfter(enddate.format('YYYY-MM-DD'))) {
			res.status(409).send('Enddate cannot be before startdate');
			return;
		}
	} else if (req.body.event.startdate || req.body.event.enddate) {
		res.status(409).send('Must supply both startdate and enddate');
		return;
	}

	if (req.body.event.priority) {
		let prio = req.body.event.priority;
		if (prio < 1 || prio > 4) {
			res.status(409).send('Invalid priority');
			return;
		}
	}

	Sequelize.Promise.all([
		db.Event.update(req.body.event,
			{ where: { id: req.params.id } }
		),
		db.SupportSeries.destroy({
			where: { event: req.params.id }
		})
	]).spread((updated, deleted) => {
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
		db.SupportSeries.bulkCreate(supportarray)
		.then(() => {
			return  db.Event.findOne({
						where: {id: req.params.id},
						include: [
							{ model: db.Track },
							{ model: db.Series},
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
					});
		}).then(event => {
			res.json(event.get({plain:true}));
		}, err => {
			util.error(req, res, err);
		});
	}, err => {
		util.error(req, res, err);
	});
};

module.exports.deleteEvent = (req, res) => {
	db.Event.destroy({
		where: { id: req.params.id }
	}).then(response => {
		if (response === 1)
			util.print('Deleted Event with id ' + req.params.id);
		res.json({ deleted: response });
	}, err => {
		util.error(req, res, err);
	});
};
