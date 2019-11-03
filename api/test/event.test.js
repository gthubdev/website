const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

describe('Events', () => {
	let seriesID, trackID, vcl_cat_id, vcl_id;
	let userid, token;

	before(async () => {
		let newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		let tmp1 = {
			name: 'Test Vehicle Class Category'
		};
		try {
			const user = await db.User.create(newuser);
			userid = user.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;

			const vcl_cat = await db.VehicleClassCategory.create(tmp1);
			vcl_cat_id = vcl_cat.id;
			let tmp2 = {
				name: 'Test Vehicle Class',
				category: vcl_cat_id
			};
			const vcl = await db.VehicleClass.create(tmp2);
			vcl_id = vcl.id;
			let tmptrack = {
				track: { name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''}
			};

			let vehicleClasses = [];
			vehicleClasses.push({id: vcl_id});
			let tmpseries = {
				series: { name: 'Test Series 1', shortname: 'TS1', priority: 1, vehicleClasses: vehicleClasses }
			};
			const [track, series] = await Sequelize.Promise.all([
				db.Track.create(tmptrack),
				db.Series.create(tmpseries)
			]);
			trackID = track.id;
			seriesID = series.id;
		} catch(err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			const response = await db.User.destroy({
				where: { id: userid }
			});
			response.should.equal(1);

			const res1 = await db.VehicleClass.destroy({
				where: { id: vcl_id }
			});
			res1.should.equal(1);

			const [res3, res4, res5] = await Sequelize.Promise.all([
				db.Series.destroy({
					where: { id: seriesID }
				}),
				db.Track.destroy({
					where: { id: trackID }
				}),
				db.VehicleClassCategory.destroy({
					where: { id: vcl_cat_id }
				})
			]);
			res3.should.equal(1);
			res4.should.equal(1);
			res5.should.equal(1);
		} catch(err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		let events = [
			{ name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries : [] },
			{ name: 'Test Event 2', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries : [] },
			{ name: 'Test Event 3', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries : [] },
			{ name: 'Test Event 4', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries : [] },
			{ name: 'Test Event 5', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries : [] }
		];
		each(events, async (event) => {
			event.supportseries = [];
			let tmp = {
				event: event
			};
			try {
				await supertest(server)
					.post('/api/calendar/event/create')
					.send(tmp)
					.set('Authorization', 'Bearer ' + token)
					.expect(200);
			} catch(err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(async () => {
		try {
			const events = await db.Event.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let ids = [];
			events.forEach(t => ids.push(t.id) );

			await db.Event.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			events.forEach(event => {
				event.name.should.have.string('Test Event');
				event.priority.should.equal(1);
				event.logo.should.equal('...');
				event.startdate.should.equal('2019-07-01');
				event.enddate.should.equal('2019-07-03');
				event.track.should.equal(trackID);
				event.mainseries.should.equal(seriesID);
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event with an invalid date', async () => {
		let event = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-X', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] };
		let tmp = {
			event: event
		};
		try {
			await supertest(server)
				.post('/api/calendar/event/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event with enddate before startdate', async () => {
		let event = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-04', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] };
		let tmp = {
			event: event
		};
		try {
			await supertest(server)
				.post('/api/calendar/event/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event with an invalid priority', async () => {
		let event = { name: 'Test Event 1', priority: -5, logo: '...', startdate: '2019-07-04', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] };
		let tmp = {
			event: event
		};
		try {
			await supertest(server)
				.post('/api/calendar/event/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					priority: 3,
					supportseries: []
				}
			};

			await supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const event = await db.Event.findOne({
				where: { id: events[0].id }
			});

			event.name.should.equal('UPDATED_EVENTNAME');
			event.priority.should.equal(3);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with an invalid date', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					enddate: '2019-07-XX',
					priority: 3,
					supportseries: []
				}
			};

			await supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with only 1 date supplied', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					enddate: '2019-07-05',
					priority: 3,
					supportseries: []
				}
			};

			await supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with enddate before startdate', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					startdate: '2019-07-06',
					enddate: '2019-07-05',
					priority: 3,
					supportseries: []
				}
			};

			await supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with an invalid priority', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					priority: 33,
					supportseries: []
				}
			};

			await supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Deleting an event', async () => {
		let nrOfEventsBefore, eventID;
		let tmp = {
			event: {
				name: 'Test Event 6',
				priority: 1,
				logo: '...',
				startdate: '2019-07-01',
				enddate: '2019-07-03',
				track: null,
				mainseries: null,
				supportseries : []
			}
		};

		try {
			const event = await db.Event.create(tmp);
			eventID = event.id;
			const events = await db.Event.findAll();
			nrOfEventsBefore = events.length;

			await supertest(server)
				.post('/api/calendar/event/delete/' + eventID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await db.Event.findAll();
			response.length.should.equal(nrOfEventsBefore - 1);
			response.forEach(e => {
				e.id.should.not.equal(eventID);
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Deleting a series which is used by an event', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			await supertest(server)
				.post('/api/calendar/series/delete/' + events[0].mainseries)
				.set('Authorization', 'Bearer ' + token)
				.expect(409);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Deleting a track which is used by an event', async () => {
		try {
			const events = await db.Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			await supertest(server)
				.post('/api/calendar/track/delete/' + events[0].track)
				.set('Authorization', 'Bearer ' + token)
				.expect(409);
		} catch(err) {
			should.not.exist(err);
		}
	});
});

describe('EventSessions', () => {
	let eventID = 1, seriesID = 1, vcl_cat_id, vcl_id;
	let userid, token;

	before(async () => {
		let newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		let tmp1 = {
			name: 'Test Vehicle Class Category'
		};

		try {
			const user = await db.User.create(newuser);
			userid = user.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;

			const vcl_cat = await db.VehicleClassCategory.create(tmp1);
			vcl_cat_id = vcl_cat.id;
			let tmp2 = {
				name: 'Test Vehicle Class',
				category: vcl_cat_id
			};

			const vcl = await db.VehicleClass.create(tmp2);
			vcl_id = vcl.id;

			let tmpevent = {
				event: { name: 'Test Event 1', priority: 5, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] }
			};
			let vehicleClasses = [];
			vehicleClasses.push({id: vcl_id});
			let tmpseries = {
				series: { name: 'Test Series 1', shortname: 'TS1', priority: 1, vehicleClasses: vehicleClasses }
			};

			const [event, series] = await Sequelize.Promise.all([
				db.Event.create(tmpevent.event),
				db.Series.create(tmpseries)
			]);
			eventID = event.id;
			seriesID = series.id;
		} catch(err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			const response = await db.User.destroy({
				where: { id: userid }
			});
			response.should.equal(1);

			const [res1, res2] = await Sequelize.Promise.all([
				db.Event.destroy({
					where: { id: eventID }
				}),
				db.VehicleClass.destroy({
					where: { id: vcl_id }
				})
			]);
			res1.should.equal(1);
			res2.should.equal(1);

			const [res3, res4] = await Sequelize.Promise.all([
				db.Series.destroy({
					where: { id: seriesID }
				}),
				db.VehicleClassCategory.destroy({
					where: { id: vcl_cat_id }
				})
			]);
			res3.should.equal(1);
			res4.should.equal(1);
		} catch(err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		let sessions = [
			{ name: 'Test Session 1', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 2', starttime: '2019-07-01 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 3', starttime: '2019-07-02 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 4', starttime: '2019-07-03 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 5', starttime: '2019-07-02 18:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		];
		each(sessions, async(es) => {
			let tmp = {
				session: es
			};
			try {
				await supertest(server)
					.post('/api/calendar/eventsession/create')
					.set('Authorization', 'Bearer ' + token)
					.send(tmp)
					.expect(200);
			} catch(err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(async () => {
		try {
			const sessions = await db.EventSession.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			let ids = [];
			sessions.forEach(s => ids.push(s.id) );

			await db.EventSession.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session', async () => {
		try {
			const sessions = await db.EventSession.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			sessions.forEach(s => {
				s.name.should.have.string('Test Session');
				moment(s.starttime).format('YYYY-MM-DD').should.have.string('2019-07-0');
				s.duration.should.equal(60);
				s.series.should.equal(seriesID);
				s.event.should.equal(eventID);
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session with an illegal starttime', async () => {
		let tmpsession = {
			session: { name: 'Test Session 6', starttime: '2019-07-XX 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		};

		try {
			await supertest(server)
				.post('/api/calendar/eventsession/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session starting before the event', async () => {
		try {
			let tmpsession = {
				session: { name: 'Test Session 6', starttime: '2019-06-30 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
			};

			await supertest(server)
				.post('/api/calendar/eventsession/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(400);

		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session starting after the event', async () => {
		try {
			let tmpsession = {
				session: { name: 'Test Session 6', starttime: '2019-07-05 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
			};

			await supertest(server)
				.post('/api/calendar/eventsession/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(400);

		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session with an invalid duration', async () => {
		let tmpsession = {
			session: { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 0, series: seriesID, event: eventID, timezone: 'UTC' }
		};

		try {
			await supertest(server)
				.post('/api/calendar/eventsession/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session', async () => {
		try {
			const sessions = await db.EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				session: {
					name: 'UPDATED_NAME',
					starttime: '2019-07-02 12:00',
					timezone: 'UTC',
					duration: 30
				}
			};

			await supertest(server)
				.post('/api/calendar/eventsession/update/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const session = await db.EventSession.findOne({
				where: { id: sessions[0].id }
			});
			session.name.should.equal('UPDATED_NAME');
			session.duration.should.equal(30);
		} catch(err) {
			should.not.exist(err);
		}
	});

	// it('Updating an event session outside the event-dates', done => {
	//
	// });

	it('Updating an event session with an illegal starttime', async () => {
		try {
			const sessions = await db.EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				session: {
					name: 'UPDATED_NAME',
					starttime: '2019-07-XX 12:00',
					timezone: 'UTC',
					duration: 30
				}
			};

			await supertest(server)
				.post('/api/calendar/eventsession/update/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session with invalid duration', async () => {
		try {
			const sessions = await db.EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				session: {
					name: 'UPDATED_NAME',
					starttime: '2019-07-02 12:00',
					timezone: 'UTC',
					duration: -2
				}
			};

			await supertest(server)
				.post('/api/calendar/eventsession/update/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Deleting an event session', async () => {
		let nrOfSessionsBefore, sessionID;
		let tmp = {
			session: { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		};

		try {
			const session = await db.EventSession.create(tmp);
			sessionID = session.id;

			const sessions = await db.EventSession.findAll();
			nrOfSessionsBefore = sessions.length;

			await supertest(server)
				.post('/api/calendar/eventsession/delete/' + sessionID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await db.EventSession.findAll();
			response.length.should.equal(nrOfSessionsBefore - 1);
			response.forEach(s => {
				s.id.should.not.equal(sessionID);
			});
		} catch(err) {
			should.not.exist(err);
		}
	});
});
