const { Series, SeriesType } = require('../models/');
const util = require('../util/util.js');
const attribute_options = require('../util/attribute_options');
const include_options = require('../util/include_options');

module.exports.findAll = async (req, res) => {
	try {
		const series = await Series.findAll({
			attributes: attribute_options.series,
			include: include_options.series,
			order: [
				['id', 'ASC']
			]
		});

		res.json(series.map(s => s.get({ plain: true })));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.findOne = async (req, res) => {
	try {
		const series = await Series.findByPk(req.params.id, {
			attributes: attribute_options.series,
			include: include_options.series
		});

		if (!series)
			res.json({ });
		else
			res.json(series.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.create = async (req, res) => {
	const prio = req.body.priority;
	if (prio < 1 || prio > 4) {
		res.status(422).send('Invalid priority');
		return;
	}

	try {
		const newseries = await Series.create(req.body);
		const vclarray = [];
		req.body.vehicleClasses.forEach(vcl => {
			vclarray.push({
				series_id: newseries.id,
				class_id: vcl
			});
		});
		await SeriesType.bulkCreate(vclarray);

		const series = await Series.findByPk(newseries.id, {
			attributes: attribute_options.series,
			include: include_options.series
		});
		util.print('Series \'' + series.name + '\' created');
		res.json(series.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (req.body.priority) {
		const prio = req.body.priority;
		if (prio < 1 || prio > 4) {
			res.status(422).send('Invalid priority');
			return;
		}
	}

	try {
		const [updated, deleted] = await Promise.all([
			Series.update(req.body,
				{ where: { id: req.params.id } }
			),
			SeriesType.destroy({
				where: { series_id: req.params.id }
			})
		]);

		if (updated !== 1 && deleted < 0) {
			util.error(req, res, 'Error updating event ' + req.event.name);
			return;
		}

		// build the array with the series.id for vehicle classes
		const vclarray = [];
		req.body.vehicleClasses.forEach(vcl => {
			vclarray.push({
				series_id: req.params.id,
				class_id: vcl
			});
		});
		await SeriesType.bulkCreate(vclarray);
		const series = await Series.findByPk(req.params.id, {
			attributes: attribute_options.series,
			include: include_options.series
		});

		util.print('Series \'' + series.name + '\' updated');
		res.json(series.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	// A series cannot be deleted, if it is the main series of an event,
	// used as a support series in an event or used in an event session
	try {
		const response = await Series.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('Series deleted: ' + response);
		res.json({ deleted: response });
	} catch (err) {
		// Errno 1451 is when trying to delete a row which is referenced
		// from another entity and 'On Delete' is set to 'RESTRICT'
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The series is used in events.');
		else
			util.error(req, res, err);
	}
};
