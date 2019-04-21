const model = require('../models/');

module.exports.getCalendar = (req, res) => {

	model.Event.findAll({
		include: [
			{
				model: model.Track
			},
			{
				model: model.EventSession,
				include: [
					{
						model: model.Series
					}
				]
			}
		]
	}).then(events => {
		res.render('calendar.ejs', {events: events});
	}, err => {
		console.error(err);
	});

};
