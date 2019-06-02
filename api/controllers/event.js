const db = require('../models');
const util = require('../util/util.js');

module.exports.createEvent = (req, res) => {
	db.Event.create(req.body.event)
	.then(newevent => {
		// build the array with the event.id for teh support series
		let supportarray = [];
		req.body.event.supportseries.forEach(s => {
			supportarray.push({
				event: newevent.id,
				series: s
			});
		});
		db.SupportSeries.bulkCreate(supportarray)
		.then(() => {
			return  db.Event.findOne({
						where: {id: newevent.id},
						include: [
							{ model: db.Track },
							{ model: db.Series},
							{
								model: db.SupportSeries,
								include: [
									{ model: db.Series }
								]
							},
							{
								model: db.EventSession,
								include: [
									{ model: db.Series }
								]
							}
						],
						order: [
							['priority', 'ASC'],
							['startdate', 'ASC'],
							[db.EventSession, 'starttime', 'ASC']
						]
					})
		}).then(event => {
			res.json(event.get({plain:true}));
		}, err => {
			util.error(req, res, err);
		});
	}, err => {
		util.error(req, res, err);
	});
};
