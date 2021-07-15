const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { Event, Series, Track, User, VehicleClass, VehicleClassCategory } = require('../models/');

describe('Events', () => {
	let seriesID, trackID, vclCatId, vclId;
	let userid, token;

	before(async () => {
		const newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		const tmp1 = {
			name: 'Test Vehicle Class Category'
		};
		try {
			const user = await User.create(newuser);
			userid = user.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;

			const vclCat = await VehicleClassCategory.create(tmp1);
			vclCatId = vclCat.id;
			const tmp2 = {
				name: 'Test Vehicle Class',
				category: vclCatId
			};
			const vcl = await VehicleClass.create(tmp2);
			vclId = vcl.id;
			const tmptrack = {
				track: { name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' }
			};

			const vehicleClasses = [];
			vehicleClasses.push({ id: vclId });
			const tmpseries = {
				series: { name: 'Test Series 1', shortname: 'TS1', priority: 1, vehicleClasses }
			};
			const [track, series] = await Promise.all([
				Track.create(tmptrack),
				Series.create(tmpseries)
			]);
			trackID = track.id;
			seriesID = series.id;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			const response = await User.destroy({
				where: { id: userid }
			});
			response.should.equal(1);

			const res1 = await VehicleClass.destroy({
				where: { id: vclId }
			});
			res1.should.equal(1);

			const [res3, res4, res5] = await Promise.all([
				Series.destroy({
					where: { id: seriesID }
				}),
				Track.destroy({
					where: { id: trackID }
				}),
				VehicleClassCategory.destroy({
					where: { id: vclCatId }
				})
			]);
			res3.should.equal(1);
			res4.should.equal(1);
			res5.should.equal(1);
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const events = [
			{ name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries: [] },
			{ name: 'Test Event 2', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries: [] },
			{ name: 'Test Event 3', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries: [] },
			{ name: 'Test Event 4', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries: [] },
			{ name: 'Test Event 5', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries: [] }
		];
		each(events, async event => {
			event.supportseries = [];
			try {
				await supertest(server)
					.post('/api/event')
					.send(event)
					.set('Authorization', 'Bearer ' + token)
					.expect(200);
			} catch (err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(async () => {
		try {
			const events = await Event.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			events.forEach(t => ids.push(t.id));

			await Event.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event', async () => {
		try {
			const events = await Event.findAll({
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
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event without authorisation', async () => {
		const tmp = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: trackID, mainseries: seriesID, supportseries: [] };

		try {
			await supertest(server)
				.post('/api/event')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event with an invalid date', async () => {
		const tmp = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-X', enddate: '2019-07-03', track: null, mainseries: null, supportseries: [] };

		try {
			await supertest(server)
				.post('/api/event')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event with enddate before startdate', async () => {
		const tmp = { name: 'Test Event 1', priority: 1, logo: '...', startdate: '2019-07-04', enddate: '2019-07-03', track: null, mainseries: null, supportseries: [] };

		try {
			await supertest(server)
				.post('/api/event')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event with an invalid priority', async () => {
		const tmp = { name: 'Test Event 1', priority: -5, logo: '...', startdate: '2019-07-04', enddate: '2019-07-03', track: null, mainseries: null, supportseries: [] };

		try {
			await supertest(server)
				.post('/api/event')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_EVENTNAME',
				priority: 3,
				supportseries: []
			};

			await supertest(server)
				.put('/api/event/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const event = await Event.findOne({
				where: { id: events[0].id }
			});

			event.name.should.equal('UPDATED_EVENTNAME');
			event.priority.should.equal(3);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event without authorisation', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_EVENTNAME',
				priority: 3,
				supportseries: []
			};

			await supertest(server)
				.put('/api/event/' + events[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with an invalid date', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_EVENTNAME',
				enddate: '2019-07-XX',
				priority: 3,
				supportseries: []
			};

			await supertest(server)
				.put('/api/event/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with only 1 date supplied', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_EVENTNAME',
				enddate: '2019-07-05',
				priority: 3,
				supportseries: []
			};

			await supertest(server)
				.put('/api/event/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with enddate before startdate', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_EVENTNAME',
				startdate: '2019-07-06',
				enddate: '2019-07-05',
				priority: 3,
				supportseries: []
			};

			await supertest(server)
				.put('/api/event/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event with an invalid priority', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_EVENTNAME',
				priority: 33,
				supportseries: []
			};

			await supertest(server)
				.put('/api/event/' + events[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting an event', async () => {
		let nrOfEventsBefore, eventID;
		const tmp = {
			name: 'Test Event 6',
			priority: 1,
			logo: '...',
			startdate: '2019-07-01',
			enddate: '2019-07-03',
			track: null,
			mainseries: null,
			supportseries: []
		};

		try {
			const event = await Event.create(tmp);
			eventID = event.id;
			const events = await Event.findAll();
			nrOfEventsBefore = events.length;

			await supertest(server)
				.delete('/api/event/' + eventID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await Event.findAll();
			response.length.should.equal(nrOfEventsBefore - 1);
			response.forEach(e => {
				e.id.should.not.equal(eventID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting an event without authorisation', async () => {
		const tmp = {
			name: 'Test Event 6',
			priority: 1,
			logo: '...',
			startdate: '2019-07-01',
			enddate: '2019-07-03',
			track: null,
			mainseries: null,
			supportseries: []
		};

		try {
			const event = await Event.create(tmp);
			await supertest(server)
				.delete('/api/event/' + event.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a series which is used by an event', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			await supertest(server)
				.delete('/api/series/' + events[0].mainseries)
				.set('Authorization', 'Bearer ' + token)
				.expect(409);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a track which is used by an event', async () => {
		try {
			const events = await Event.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			await supertest(server)
				.delete('/api/track/' + events[0].track)
				.set('Authorization', 'Bearer ' + token)
				.expect(409);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
