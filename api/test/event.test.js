const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

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
					res.status.should.equal(409);
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
					res.status.should.equal(409);
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
					res.status.should.equal(409);
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
					res.status.should.equal(409);
					should.not.exist(err);
					done();
				});
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Updating an event with only date supplied', done => {
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
					res.status.should.equal(409);
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
					res.status.should.equal(409);
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
					res.status.should.equal(409);
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

	// it('Creating an event session', done => {
	// 	done();
	// });
	//
	// it('Creating an event session with an illegal date', done => {
	//
	// });
	//
	// it('Creating an event session outside the event-dates', done => {
	//
	// });
	//
	// it('Creating an event session with invalid duration', done => {
	//
	// });
	//
	// it('Updating an event', done => {
	//
	// });
	//
	//
	// it('Updating an event session outside the event-dates', done => {
	//
	// });
	//
	// it('Updating an event session with invalid duration', done => {
	//
	// });
	// it('Deleting an event', done => {
	//
	// });
});
