const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');

describe('Events', () => {
	beforeEach(done => {
		let events = [
			{ name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] },
			{ name: 'Test Event 2', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] },
			{ name: 'Test Event 3', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] },
			{ name: 'Test Event 4', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] },
			{ name: 'Test Event 5', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] }
		];
		each(events, function(event, callback) {
			event.supportseries = [];
			let tmp = {
				event: event
			};
			supertest(server)
				.post('/api/calendar/event/create')
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(200);
					should.not.exist(err);
					callback();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(done => {
		db.Event.findAll({
			limit: 5,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			let ids = [];
			events.forEach(t => ids.push(t.id) );
			db.Event.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			}).then(() => {
				done();
			});
		});
	});

	it('Creating an event', done => {
		db.Event.findAll({
			limit: 5,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			events.forEach(event => {
				event.name.should.have.string('Test Event');
				event.priority.should.equal(1);
				event.logo.should.equal('...');
				event.startdate.should.equal('2019-07-01');
				event.enddate.should.equal('2019-07-03');
				(event.track === null).should.be.true;
				(event.mainseries === null).should.be.true;
			});
			done();
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating an event with an invalid date', done => {
		let event = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-X', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] };
		let tmp = {
			event: event
		};
		supertest(server)
				.post('/api/calendar/event/create')
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
	});

	it('Creating an event with enddate before startdate', done => {
		let event = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-04', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] };
		let tmp = {
			event: event
		};
		supertest(server)
				.post('/api/calendar/event/create')
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
	});

	it('Creating an event with an invalid priority', done => {
		let event = { name: 'Test Event 1', priority: -5, logo: '...', startdate: '2019-07-04', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] };
		let tmp = {
			event: event
		};
		supertest(server)
				.post('/api/calendar/event/create')
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
	});

	it('Updating an event', done => {
		db.Event.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					priority: 3,
					supportseries: []
				}
			};
			supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(200);
					should.not.exist(err);
					db.Event.findOne({
						where: { id: events[0].id }
					}).then(event => {
						event.name.should.equal('UPDATED_EVENTNAME');
						event.priority.should.equal(3);
						done();
					}, err => {
						should.not.exist(err);
						done();
					});
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating an event with an invalid date', done => {
		db.Event.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					enddate: '2019-07-XX',
					priority: 3,
					supportseries: []
				}
			};
			supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating an event with only 1 date supplied', done => {
		db.Event.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					enddate: '2019-07-05',
					priority: 3,
					supportseries: []
				}
			};
			supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating an event with enddate before startdate', done => {
		db.Event.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					startdate: '2019-07-06',
					enddate: '2019-07-05',
					priority: 3,
					supportseries: []
				}
			};
			supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating an event with an invalid priority', done => {
		db.Event.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(events => {
			let tmp = {
				event: {
					name: 'UPDATED_EVENTNAME',
					priority: 33,
					supportseries: []
				}
			};
			supertest(server)
				.post('/api/calendar/event/update/' + events[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Deleting an event', done => {
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
		db.Event.create(tmp)
		.then(event => {
			eventID = event.id;
			db.Event.findAll()
			.then(events => {
				nrOfEventsBefore = events.length;
				supertest(server)
					.post('/api/calendar/event/delete/' + eventID)
					.end((err, res) => {
						res.status.should.equal(200);
						should.not.exist(err);
						db.Event.findAll()
						.then(response => {
							response.length.should.equal(nrOfEventsBefore - 1);
							response.forEach(e => {
								e.id.should.not.equal(eventID);
							});
							done();
						}, err => {
							should.not.exist(err);
							done();
						});
					}, err => {
						should.not.exist(err);
						done();
					});
			}, err => {
				should.not.exist(err);
				done();
			});
		}, err => {
			should.not.exist(err);
			done();
		});
	});
});

describe('EventSessions', () => {
	let eventID = 1, seriesID = 1, vcl_cat_id, vcl_id;

	before(done => {
		let tmp1 = {
			name: 'Test Vehicle Class Category'
		};
		db.VehicleClassCategory.create(tmp1)
		.then(vcl_cat => {
			vcl_cat_id = vcl_cat.id;
			let tmp2 = {
				name: 'Test Vehicle Class',
				category: vcl_cat_id
			};
			db.VehicleClass.create(tmp2)
			.then(vcl => {
				vcl_id = vcl.id;

				let tmpevent = {
					event: { name: 'Test Event 1', priority: -5, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries : [] }
				};

				let vehicleClasses = [];
				vehicleClasses.push({id: vcl_id});
				let tmpseries = {
					series: { name: 'Test Series 1', shortname: 'TS1', priority: 1, vehicleClasses: vehicleClasses }
				};

				Sequelize.Promise.all([
					db.Event.create(tmpevent),
					db.Series.create(tmpseries)
				]).spread((event, series) => {
					eventID = event.id;
					seriesID = series.id;
					done();
				}, err => {
					should.not.exist(err);
					done();
				});
			}, err => {
				should.not.exist(err);
				done();
			});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	after(done => {
		Sequelize.Promise.all([
			db.Event.destroy({
				where: { id: eventID }
			}),
			db.VehicleClass.destroy({
				where: { id: vcl_id }
			})
		]).spread((res1, res2) => {
			res1.should.equal(1);
			res2.should.equal(1);
			Sequelize.Promise.all([
				db.Series.destroy({
					where: { id: seriesID }
				}),
				db.VehicleClassCategory.destroy({
					where: { id: vcl_cat_id }
				})
			]).spread((res3, res4) => {
				res3.should.equal(1);
				res4.should.equal(1);
				done();
			}, err => {
				should.not.exist(err);
				done();
			});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	beforeEach(done => {
		let sessions = [
			{ name: 'Test Session 1', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 2', starttime: '2019-07-01 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 3', starttime: '2019-07-02 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 4', starttime: '2019-07-03 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' },
			{ name: 'Test Session 5', starttime: '2019-07-02 18:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		];
		each(sessions, function(es, callback) {
			let tmp = {
				session: es
			};
			supertest(server)
				.post('/api/calendar/eventsession/create')
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(200);
					should.not.exist(err);
					callback();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(done => {
		db.EventSession.findAll({
			limit: 5,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(sessions => {
			let ids = [];
			sessions.forEach(s => ids.push(s.id) );
			db.EventSession.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			}).then(() => {
				done();
			});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating an event session', done => {
		db.EventSession.findAll({
			limit: 5,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(sessions => {
			sessions.forEach(s => {
				s.name.should.have.string('Test Session');
				moment(s.starttime).format('YYYY-MM-DD').should.have.string('2019-07-0');
				s.duration.should.equal(60);
				s.series.should.equal(seriesID);
				s.event.should.equal(eventID);
			});
			done();
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating an event session with an illegal starttime', done => {
		let tmpsession = {
			session: { name: 'Test Session 6', starttime: '2019-07-XX 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		};
		supertest(server)
			.post('/api/calendar/eventsession/create')
			.send(tmpsession)
			.end((err, res) => {
				res.status.should.equal(400);
				should.not.exist(err);
				done();
			});
	});

	// it('Creating an event session outside the event-dates', done => {
	//
	// });

	it('Creating an event session with an invalid duration', done => {
		let tmpsession = {
			session: { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 0, series: seriesID, event: eventID, timezone: 'UTC' }
		};
		supertest(server)
			.post('/api/calendar/eventsession/create')
			.send(tmpsession)
			.end((err, res) => {
				res.status.should.equal(400);
				should.not.exist(err);
				done();
			});
	});

	it('Updating an event session', done => {
		db.EventSession.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(sessions => {
			let tmp = {
				session: {
					name: 'UPDATED_NAME',
					starttime: '2019-07-02 12:00',
					timezone: 'UTC',
					duration: 30
				}
			};
			supertest(server)
				.post('/api/calendar/eventsession/update/' + sessions[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(200);
					should.not.exist(err);
					db.EventSession.findOne({
						where: { id: sessions[0].id }
					}).then(session => {
						session.name.should.equal('UPDATED_NAME');
						session.duration.should.equal(30);
						done();
					}, err => {
						should.not.exist(err);
						done();
					});
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	// it('Updating an event session outside the event-dates', done => {
	//
	// });

	it('Updating an event session with an illegal starttime', done => {
		db.EventSession.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(sessions => {
			let tmp = {
				session: {
					name: 'UPDATED_NAME',
					starttime: '2019-07-XX 12:00',
					timezone: 'UTC',
					duration: 30
				}
			};
			supertest(server)
				.post('/api/calendar/eventsession/update/' + sessions[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating an event session with invalid duration', done => {
		db.EventSession.findAll({
			limit: 1,
			order: [
				['createdAt', 'DESC'],
				['id', 'DESC']
			]
		}).then(sessions => {
			let tmp = {
				session: {
					name: 'UPDATED_NAME',
					starttime: '2019-07-02 12:00',
					timezone: 'UTC',
					duration: -2
				}
			};
			supertest(server)
				.post('/api/calendar/eventsession/update/' + sessions[0].id)
				.send(tmp)
				.end((err, res) => {
					res.status.should.equal(400);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Deleting an event', done => {
		let nrOfSessionsBefore, sessionID;
		let tmp = {
			session: { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		};
		db.EventSession.create(tmp)
		.then(session => {
			sessionID = session.id;
			db.EventSession.findAll()
			.then(sessions => {
				nrOfSessionsBefore = sessions.length;
				supertest(server)
					.post('/api/calendar/eventsession/delete/' + sessionID)
					.end((err, res) => {
						res.status.should.equal(200);
						should.not.exist(err);
						db.EventSession.findAll()
						.then(response => {
							response.length.should.equal(nrOfSessionsBefore - 1);
							response.forEach(s => {
								s.id.should.not.equal(sessionID);
							});
							done();
						}, err => {
							should.not.exist(err);
							done();
						});
					}, err => {
						should.not.exist(err);
						done();
					});
			}, err => {
				should.not.exist(err);
				done();
			});
		}, err => {
			should.not.exist(err);
			done();
		});
	});
});
