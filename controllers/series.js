const db = require('../models/');
const util = require('../util/util.js');

module.exports.createSeries = (req, res) => {
	db.Series.create(req.body)
	.then(series => {
		util.print('Series \'' + series.name + '\' created');
		res.redirect('/calendar');
	}, err => {
		util.error(req, res, err);
	});
};
