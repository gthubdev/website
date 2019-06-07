const db = require('../models');
const util = require('../util/util.js');
const moment = require('moment-timezone');

module.exports.createEventSession = (req, res) => {

	// need to convert the local starttime into UTC
	req.body.session.starttime = getLocalTime(req.body.session);

	db.EventSession.create(req.body.session)
	.then(newsession => {
		// query the newly created session to include series-info
		return db.EventSession.findOne({
			where: {id: newsession.id},
			include : [
				{ model: db.Series }
			]
		})
	}).then(eventsession => {
		util.print('EventSession \'' + eventsession.name + '\' created');
		res.json(eventsession.get({plain:true}));
	}, err => {
		util.error(req, res, err);
	});
};

module.exports.updateEventSession = (req, res) => {

	if (!req.body.session || !req.body.session.timezone) {
		res.status(400).send('Bad request');
		return;
	}

	// need to convert the local starttime into UTC
	req.body.session.starttime = getLocalTime(req.body.session);

	db.EventSession.update(req.body.session,
		{ where: { id: req.params.id } }
	).then(response => {
		if (response[0] >= 1)
			util.print(response[0] + ' EventSessions updated');
		res.json({ updated: response[0] });
	}, err => {
		util.error(req, res, err);
	});
};

module.exports.deleteEventSession = (req, res) => {
	db.EventSession.destroy({
		where: { id: req.params.id }
	}).then(response => {
		if (response === 1)
			util.print('Deleted EventSession with id ' + req.params.id);
		res.json({ deleted: response });
	}, err => {
		util.error(req, res, err);
	});
};

function getLocalTime(session) {
	let oldstart = moment.utc(session.starttime);

	let zone = moment.tz.zone(session.timezone);
	let offset = zone.parse(Date.UTC(
		oldstart.get('year'),
		oldstart.get('month'),
		oldstart.get('date'),
		oldstart.get('hour'),
		oldstart.get('minute')));

	let newstart = moment(oldstart).add(offset, 'm');

	return newstart.format();
}
