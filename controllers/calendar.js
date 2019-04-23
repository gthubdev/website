const db = require('../models/');
const Sequelize = require('sequelize');

module.exports.getCalendar = (req, res) => {

	Sequelize.Promise.all([
		db.Event.findAll({
			include: [
				{ model: db.Track },
				{
					model: db.EventSession,
					include: [
						{ model: db.Series }
					]
				}
			]
		}),
		db.Series.findAll({
			order: [
				['name', 'ASC']
			]
		})
	]).spread((events, series) => {
		res.render('calendar.ejs',
			{
				events: events,
				series: series
			});
	}, err => {
		console.error(err);
	});

};
