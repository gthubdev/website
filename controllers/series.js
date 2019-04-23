const db = require('../models/');
const util = require('../util/util.js');

module.exports.createSeries = (req, res) => {
	db.Series.create(req.body)
	.then(series => {
		util.print('Series \'' + req.body.name + '\' created');
		res.redirect('/calendar');
	}, err => {
		util.print('Ups. Something went wrong trying to create a series.');
		util.print(err);
		res.redirect('/calendar');
	});
};
