const db = require('../models/');
const util = require('../util/util.js');

module.exports.createSeries = (req, res) => {
	db.Series.create(req.body.series)
	.then(series => {
		util.print('Series \'' + series.name + '\' created');
		res.json(series.get({plain:true}));
	}, err => {
		util.error(req, res, err);
	});
};
