const dayjs = require('dayjs');
const { Event, EventSession, SupportSeries } = require('../models');
const util = require('../util/util.js');
const dateformat = 'YYYY-MM-DD';
const attribute_options = require('../util/attribute_options');
const include_options = require('../util/include_options');

module.exports.findAll = async (req, res) => {
	try {
		const events = await Event.findAll({
			attributes: attribute_options.event,
			include: include_options.event,
			order: [
				['id', 'ASC']
			]
		});

		res.json(events.map(e => e.get({ plain: true })));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.create = async (req, res) => {
	const startdate = dayjs(req.body.startdate);
	const enddate = dayjs(req.body.enddate);

	if (startdate.format(dateformat) !== req.body.startdate) {
		res.status(422).send('Invalid startdate');
		return;
	}

	if (enddate.format(dateformat) !== req.body.enddate) {
		res.status(422).send('Invalid enddate');
		return;
	}

	if (startdate.isAfter(enddate.format('YYYY-MM-DD'))) {
		res.status(422).send('Enddate cannot be before startdate');
		return;
	}

	const prio = req.body.priority;
	if (prio < 1 || prio > 4) {
		res.status(422).send('Invalid priority');
		return;
	}

	try {
		const newevent = await Event.create(req.body);

		// build the array with the event.id for the support series
		const supportarray = [];
		req.body.supportseries.forEach(s => {
			supportarray.push({
				event_id: newevent.id,
				series_id: s.id
			});
		});
		await SupportSeries.bulkCreate(supportarray);

		const event = await Event.findByPk(newevent.id, {
			attributes: attribute_options.event,
			include: include_options.event,
			order: [
				['priority', 'ASC'],
				['startdate', 'ASC'],
				[EventSession, 'starttime', 'ASC']
			]
		});
		util.print('Event \'' + event.name + '\' created');
		res.json(event.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (req.body.startdate && req.body.enddate) {
		const startdate = dayjs(req.body.startdate);
		const enddate = dayjs(req.body.enddate);

		if (startdate.format(dateformat) !== req.body.startdate) {
			res.status(422).send('Invalid startdate');
			return;
		}

		if (enddate.format(dateformat) !== req.body.enddate) {
			res.status(422).send('Invalid enddate');
			return;
		}

		if (startdate.isAfter(enddate.format('YYYY-MM-DD'))) {
			res.status(422).send('Enddate cannot be before startdate');
			return;
		}
	} else if (req.body.startdate || req.body.enddate) {
		res.status(422).send('Must supply both startdate and enddate');
		return;
	}

	if (req.body.priority) {
		const prio = req.body.priority;
		if (prio < 1 || prio > 4) {
			res.status(422).send('Invalid priority');
			return;
		}
	}

	try {
		const [updated, deleted] = await Promise.all([
			Event.update(req.body,
				{ where: { id: req.params.id } }
			),
			SupportSeries.destroy({
				where: { event_id: req.params.id }
			})
		]);
		if (updated !== 1 && deleted < 0) {
			util.error(req, res, 'Error updating event ' + req.body.name);
			return;
		}

		// build the array with the event.id for the support series
		const supportarray = [];
		req.body.supportseries.forEach(s => {
			supportarray.push({
				event_id: req.params.id,
				series_id: s.id
			});
		});
		await SupportSeries.bulkCreate(supportarray);

		const event = await Event.findOne({
			where: { id: req.params.id },
			attributes: attribute_options.event,
			include: include_options.event,
			order: [
				['priority', 'ASC'],
				['startdate', 'ASC'],
				[EventSession, 'starttime', 'ASC']
			]
		});
		res.json(event.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await Event.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('Events deleted: ' + response);
		res.json({ deleted: response });
	} catch (err) {
		util.error(req, res, err);
	}
};
