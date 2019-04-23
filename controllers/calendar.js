const db = require('../models/');

module.exports.getCalendar = (req, res) => {

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
	}).then(events => {
		res.render('calendar.ejs', {events: events});
	}, err => {
		console.error(err);
	});

};
