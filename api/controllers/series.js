const { Series, SeriesType, VehicleClass, VehicleClassCategory } = require('../models/');
const util = require('../util/util.js');

module.exports.createSeries = async (req, res) => {
	const prio = req.body.series.priority;
	if (prio < 1 || prio > 4) {
		res.status(422).send('Invalid priority');
		return;
	}

	try {
		const newseries = await Series.create(req.body.series);
		const vclarray = [];
		req.body.series.vehicleClasses.forEach(vcl => {
			vclarray.push({
				series: newseries.id,
				class: vcl
			});
		});
		await SeriesType.bulkCreate(vclarray);
		const series = await Series.findOne({
			where: { id: newseries.id },
			include: [
				{
					model: SeriesType,
					include: [
						{
							model: VehicleClass,
							include: [
								{ model: VehicleClassCategory }
							]
						}
					]
				}
			]
		});
		util.print('Series \'' + series.name + '\' created');
		res.json(series.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.updateSeries = async (req, res) => {
	if (req.body.series.priority) {
		const prio = req.body.series.priority;
		if (prio < 1 || prio > 4) {
			res.status(422).send('Invalid priority');
			return;
		}
	}

	try {
		const [updated, deleted] = await Promise.all([
			Series.update(req.body.series,
				{ where: { id: req.params.id } }
			),
			SeriesType.destroy({
				where: { series: req.params.id }
			})
		]);

		if (updated !== 1 && deleted < 0) {
			util.error(req, res, 'Error updating event ' + req.body.event.name);
			return;
		}

		// build the array with the series.id for vehicle classes
		const vclarray = [];
		req.body.series.vehicleClasses.forEach(vcl => {
			vclarray.push({
				series: req.params.id,
				class: vcl
			});
		});
		await SeriesType.bulkCreate(vclarray);
		const series = await Series.findOne({
			where: { id: req.params.id },
			include: [
				{
					model: SeriesType,
					include: [
						{
							model: VehicleClass,
							include: [
								{ model: VehicleClassCategory }
							]
						}
					]
				}
			]
		});
		util.print('Series \'' + series.name + '\' updated');
		res.json(series.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.deleteSeries = async (req, res) => {
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
