const util = require('../util/util.js');
const { VehicleClassCategory } = require('../models');

module.exports.findAll = async (req, res) => {
	const vehiclecats = await VehicleClassCategory.findAll({
		order: [
			['id', 'ASC']
		]
	});

	return res.json(vehiclecats);
};

module.exports.findOne = async (req, res) => {
	const vehicleCat = await VehicleClassCategory.findOne({
		where: { id: req.params.id }
	});

	if (!vehicleCat) return res.status(404).send('No Vehicle Category found');

	return res.json(vehicleCat);
};

module.exports.create = async (req, res) => {
	if (!req.body.name) return res.status(400).send('Cannot create from empty data');

	try {
		const category = await VehicleClassCategory.create(req.body);
		return res.json(category);
	} catch (err) {
		return util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body.name) return res.status(400).send('Cannot create from empty data');

	try {
		const category = await VehicleClassCategory.update(req.body, {
			where: { id: req.params.id }
		});

		return res.json(category);
	} catch (err) {
		return util.err(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await VehicleClassCategory.destroy({
			where: { id: req.params.id }
		});

		return res.json(response);
	} catch (err) {
		return util.error(req, res, err);
	}
};
