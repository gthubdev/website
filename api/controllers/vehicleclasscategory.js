const util = require('../util/util.js');
const { VehicleClassCategory } = require('../models');

module.exports.findAll = async (req, res) => {
	try {
		const vehiclecats = await VehicleClassCategory.findAll({
			attributes: ['id', 'name'],
			order: [
				['id', 'ASC']
			],
			raw: true
		});

		res.json(vehiclecats);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.findOne = async (req, res) => {
	try {
		const vehicleCat = await VehicleClassCategory.findByPk(req.params.id, {
			raw: true
		});

		if (!vehicleCat)
			res.json({ });
		else
			res.json(vehicleCat);
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
		const category = await VehicleClassCategory.create(req.body, {
			raw: true
		});

		res.json(category);
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
		const response = await VehicleClassCategory.update(req.body, {
			where: { id: req.params.id }
		});
		if (response[0] === 0)
			return;

		const category = await VehicleClassCategory.findByPk(req.params.id, {
			raw: true
		});
		res.json(category);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await VehicleClassCategory.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('VehicleClassCategories deleted: ' + response);

		res.json({ deleted: response });
	} catch (err) {
		return util.error(req, res, err);
	}
};
