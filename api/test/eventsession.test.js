const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const dayjs = require('dayjs');
const server = require('../index');
const { Event, EventSession, Series, User, VehicleClass, VehicleClassCategory } = require('../models/');

describe('EventSessions', () => {
	let eventID = 1; let seriesID = 1; let vclCatId; let vclId;
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

			const tmpevent = {
				event: { name: 'Test Event 1', priority: 5, logo: '...', startdate: '2019-07-01', enddate: '2019-07-03', track: null, mainseries: null, supportseries: [] }
			};
			const vehicleClasses = [];
			vehicleClasses.push({ id: vclId });
			const tmpseries = {
				series: { name: 'Test Series 1', shortname: 'TS1', priority: 1, vehicleClasses }
			};

			const [event, series] = await Promise.all([
				Event.create(tmpevent.event),
				Series.create(tmpseries)
			]);
			eventID = event.id;
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

			const [res1, res2] = await Promise.all([
				Event.destroy({
					where: { id: eventID }
				}),
				VehicleClass.destroy({
					where: { id: vclId }
				})
			]);
			res1.should.equal(1);
			res2.should.equal(1);

			const [res3, res4] = await Promise.all([
				Series.destroy({
					where: { id: seriesID }
				}),
				VehicleClassCategory.destroy({
					where: { id: vclCatId }
				})
			]);
			res3.should.equal(1);
			res4.should.equal(1);
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const sessions = [
			{ name: 'Test Session 1', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'Europe/Stockholm', sessiontype: 1 },
			{ name: 'Test Session 2', starttime: '2019-07-01 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'America/New_York', sessiontype: 1 },
			{ name: 'Test Session 3', starttime: '2019-07-02 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'Europe/Stockholm', sessiontype: 2 },
			{ name: 'Test Session 4', starttime: '2019-07-03 12:00', duration: 60, series: seriesID, event: eventID, timezone: 'Europe/Stockholm', sessiontype: 3 },
			{ name: 'Test Session 5', starttime: '2019-07-02 18:00', duration: 60, series: seriesID, event: eventID, timezone: 'Europe/Stockholm', sessiontype: 4 }
		];
		each(sessions, async es => {
			try {
				await supertest(server)
					.post('/api/eventsession')
					.set('Authorization', 'Bearer ' + token)
					.send(es)
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
			const sessions = await EventSession.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			const ids = [];
			sessions.forEach(s => ids.push(s.id));

			await EventSession.destroy({
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

	it('Creating an event session', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			sessions.forEach(s => {
				s.name.should.have.string('Test Session');
				dayjs(s.starttime).format('YYYY-MM-DD').should.have.string('2019-07-0');
				s.duration.should.equal(60);
				s.series.should.equal(seriesID);
				s.event.should.equal(eventID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session without authorisation', async () => {
		const tmp = { name: 'Test Session 1', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'Europe/Stockholm', sessiontype: 1 };

		try {
			await supertest(server)
				.post('/api/eventsession')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session with an illegal starttime', async () => {
		const tmpsession = { name: 'Test Session 6', starttime: '2019-07-XX 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' };

		try {
			await supertest(server)
				.post('/api/eventsession')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session starting before the event', async () => {
		try {
			const tmpsession = { name: 'Test Session 6', starttime: '2019-06-30 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' };

			await supertest(server)
				.post('/api/eventsession')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session starting after the event', async () => {
		try {
			const tmpsession = { name: 'Test Session 6', starttime: '2019-07-05 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' };

			await supertest(server)
				.post('/api/eventsession')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session with an invalid duration', async () => {
		const tmpsession = { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 0, series: seriesID, event: eventID, timezone: 'UTC' };

		try {
			await supertest(server)
				.post('/api/eventsession')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating an event session with an invalid sessiontype', async () => {
		const tmpsession = { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 0, series: seriesID, event: eventID, timezone: 'UTC', sessiontype: 5 };

		try {
			await supertest(server)
				.post('/api/eventsession')
				.set('Authorization', 'Bearer ' + token)
				.send(tmpsession)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-07-02 12:00',
				timezone: 'UTC',
				duration: 30
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const session = await EventSession.findOne({
				where: { id: sessions[0].id }
			});
			session.name.should.equal('UPDATED_NAME');
			session.duration.should.equal(30);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session without authorisation', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-07-02 12:00',
				timezone: 'UTC',
				duration: 30
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session with a start before the event', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-06-29 12:00',
				timezone: 'UTC',
				duration: 30
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session with a start after the event', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-07-29 12:00',
				timezone: 'UTC',
				duration: 30
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session with an illegal starttime', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-07-XX 12:00',
				timezone: 'UTC',
				duration: 30
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session with invalid duration', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-07-02 12:00',
				timezone: 'UTC',
				duration: -2
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating an event session with invalid sessiontype', async () => {
		try {
			const sessions = await EventSession.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				id: sessions[0].id,
				name: 'UPDATED_NAME',
				starttime: '2019-07-02 12:00',
				timezone: 'UTC',
				duration: 20,
				sessiontype: -2
			};

			await supertest(server)
				.put('/api/eventsession/' + sessions[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting an event session', async () => {
		let nrOfSessionsBefore, sessionID;
		const tmp = {
			session: { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		};

		try {
			const session = await EventSession.create(tmp);
			sessionID = session.id;

			const sessions = await EventSession.findAll();
			nrOfSessionsBefore = sessions.length;

			await supertest(server)
				.delete('/api/eventsession/' + sessionID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await EventSession.findAll();
			response.length.should.equal(nrOfSessionsBefore - 1);
			response.forEach(s => {
				s.id.should.not.equal(sessionID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting an event session without authorisation', async () => {
		const tmp = {
			session: { name: 'Test Session 6', starttime: '2019-07-02 10:00', duration: 60, series: seriesID, event: eventID, timezone: 'UTC' }
		};

		try {
			const session = await EventSession.create(tmp);
			await supertest(server)
				.delete('/api/eventsession/' + session.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
