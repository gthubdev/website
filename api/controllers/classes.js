const { VehicleClass, VehicleClassCategory } = require('../models');

module.exports.find = async (req, res) => {
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
