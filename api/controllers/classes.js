const util = require('../util/util.js');
const { VehicleClass, VehicleClassCategory } = require('../models');

module.exports.findAll = async (req, res) => {
	const vehicleclasses = await VehicleClass.findAll({
		include: [
			{ model: VehicleClassCategory }
		],
		order: [
			['id', 'ASC']
		]
	});

	return res.json(vehicleclasses);
};

module.exports.findOne = async (req, res) => {
	const vehicleclass = await VehicleClass.findOne({
		where: { id: req.params.id },
		include: [
			{
				model: VehicleClassCategory
			}
		]
	});

	if (!vehicleclass) return res.status(404).send('no class found');

	return res.json(vehicleclass);
};

module.exports.create = async (req, res) => {
	if (!req.body) return res.status(400).send('Cannot create data from nothing');

	try {
		const vehicleclass = await VehicleClass.create(req.body);

		return res.json(vehicleclass);
	} catch (err) {
		return util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body) return res.status(400).send('Cannot create data from nothing');

	try {
		const vehicleclass = await VehicleClass.update(req.body, {
			where: { id: req.params.id }
		});
		return res.json(vehicleclass);
	} catch (err) {
		return util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await VehicleClass.destroy({
			where: { id: req.params.id }
		});

		return res.json(response);
	} catch (err) {
		return util.error(req, res, err);
	}
};
