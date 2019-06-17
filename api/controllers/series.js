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

module.exports.updateSeries = (req, res) => {
	db.Series.update(req.body.series,
		{where: { id: req.params.id }
	}).then(response => {
		if (response[0] >= 1)
			util.print(response[0] + ' Series updated');
		res.json({ updated: response[0] });
	}, err => {
		util.error(req, res, err);
	});
};

module.exports.deleteSeries = (req, res) => {
	// A series cannot be deleted, if it is the main series of an event,
	// used as a support series in an event or used in an event session
	db.Series.destroy({
		where: { id: req.params.id }
	}).then(response => {
		if (response >= 1)
			util.print('Series deleted: ' + response);
		res.json({ deleted: response });
	}, err => {
		// Errno 1451 is when trying to delete a row which is referenced
		// from another entity and 'On Delete' is set to 'RESTRICT'
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The series is used in events.');
		else
			util.error(req, res, err);
	});
};
