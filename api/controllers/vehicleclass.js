const util = require('../util/util.js');
const { VehicleClass, VehicleClassCategory } = require('../models');

module.exports.findAll = async (req, res) => {
	try {
		const vehicleclasses = await VehicleClass.findAll({
			attributes: ['id', 'name', 'category_id'],
			include: [
				{
					model: VehicleClassCategory,
					attributes: ['id', 'name']
				}
			],
			order: [
				['id', 'ASC']
			],
			raw: true,
			nest: true
		});

		res.json(vehicleclasses);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.findOne = async (req, res) => {
	try {
		const vehicleclass = await VehicleClass.findByPk(req.params.id, {
			attributes: ['id', 'name', 'category_id'],
			include: [
				{
					model: VehicleClassCategory,
					attributes: ['id', 'name']
				}
			],
			raw: true,
			nest: true
		});

		if (!vehicleclass)
			res.json({ });
		else
			res.json(vehicleclass);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.create = async (req, res) => {
	if (!req.body.name || !req.body.category_id) {
		res.status(422).send('Cannot create from empty data');
		return;
	}

	try {
		const tmp = await VehicleClass.create(req.body);

		const vehicleclass = await VehicleClass.findByPk(tmp.id, {
			attributes: ['id', 'name', 'category_id'],
			include: [
				{
					model: VehicleClassCategory,
					attributes: ['id', 'name']
				}
			],
			raw: true,
			nest: true
		});
		res.json(vehicleclass);
	} catch (err) {
		if (err.parent && err.parent.errno && err.parent.errno === 1452)
			res.status(422).send('Invalid category.');
		else
			util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body.name && !req.body.category_id) {
		res.status(422).send('Cannot update from empty data');
		return;
	}

	try {
		const response = await VehicleClass.update(req.body, {
			where: { id: req.params.id }
		});
		if (response[0] === 0)
			return;

		const vehicleclass = await VehicleClass.findByPk(req.params.id, {
			include: [
				{
					model: VehicleClassCategory,
					attributes: ['id', 'name']
				}
			],
			raw: true,
			nest: true
		});

		res.json(vehicleclass);
	} catch (err) {
		if (err.parent && err.parent.errno && err.parent.errno === 1452)
			res.status(422).send('Invalid category.');
		else
			util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await VehicleClass.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('VehicleClasses deleted: ' + response);

		res.json({ deleted: response });
	} catch (err) {
		util.error(req, res, err);
	}
};
