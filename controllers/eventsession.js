const db = require('../models');
const util = require('../util/util.js');
const moment = require('moment-timezone');

module.exports.createEventSession = (req, res) => {

	// need to change this in the future
	// send the event's timezone in the request
	// requires changes to the frontend
	db.Event.findOne({
		where: { id: req.body.event },
		raw: true
	})
	.then(event => {
		//console.log('Timezone for event: ' + event.timezone);

		let oldstart = moment.utc(req.body.starttime);
		let oldend = moment.utc(req.body.endtime);
		//console.log('Local starttime: ' + oldstart.format());

		let zone = moment.tz.zone(event.timezone);
		let offset = zone.parse(Date.UTC(
			oldstart.get('year'),
			oldstart.get('month'),
			oldstart.get('date'),
			oldstart.get('hour'),
			oldstart.get('minute')));
		//console.log('Offset for timezone in relation to UTC: ' + offset + 'mins');

		let newstart = moment(oldstart).add(offset, 'm');
		let newend = moment(oldend).add(offset, 'm');
		//console.log('Starttime in UTC: ' + newstart.format());

		req.body.starttime = newstart.format();
		req.body.endtime = newend.format();

		db.EventSession.create(req.body)
		.then(eventsession => {
			util.print('EventSession \'' + eventsession.name + '\' created');
			res.redirect('/calendar');
		}, err => {
			util.error(req, res, err);
		});
	}, err => {
		util.error(req, res, err);
	});

};
