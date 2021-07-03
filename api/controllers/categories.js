const { VehicleClassCategory } = require('../models');

module.exports.find = async (req, res) => {
	const vehiclecats = await VehicleClassCategory.findAll({
		order: [
			['id', 'ASC']
		]
	});

	return res.json(vehiclecats);
};
