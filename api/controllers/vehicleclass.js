const util = require('../util/util.js');
const { VehicleClass, VehicleClassCategory } = require('../models');

module.exports.findAll = async (req, res) => {
	try {
		const vehicleclasses = await VehicleClass.findAll({
			include: [
				{ model: VehicleClassCategory }
			],
			order: [
				['id', 'ASC']
			]
		});

		res.json(vehicleclasses);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.findOne = async (req, res) => {
	try {
		const vehicleclass = await VehicleClass.findByPk(req.params.id, {
			include: [
				{
					model: VehicleClassCategory
				}
			]
		});

		if (!vehicleclass)
			res.json({ });
		else
			res.json(vehicleclass.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.create = async (req, res) => {
	if (!req.body.name) {
		res.status(422).send('Cannot create from empty data');
		return;
	}

	try {
		const vehicleclass = await VehicleClass.create(req.body);

		return res.json(vehicleclass.get({ plain: true }));
	} catch (err) {
		return util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body.name) {
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
					model: VehicleClassCategory
				}
			]
		});

		res.json(vehicleclass.get({ plain: true }));
	} catch (err) {
		return util.error(req, res, err);
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
		return util.error(req, res, err);
	}
};
