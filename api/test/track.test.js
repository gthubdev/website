const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

describe('Tracks', () => {
	let userid, token;
	// Create user testuser/admin
	before(async () => {
		let newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		const user = await db.User.create(newuser);
		userid = user.id;
		try {
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' });

			token = res.body.token;
		} catch(err) {
			should.not.exist(err);
		}

	});

	after(async () => {
		const response = await db.User.destroy({
			where: { id: userid }
		});
		response.should.equal(1);
	});

	beforeEach(done => {
		let tracks = [
			{ name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 2', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 3', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 4', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''},
			{ name: 'Test Track 5', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: ''}
		];
		each(tracks, async (track) => {
			// Need this, because the controller is parsing req.body.track
			let tmp = {
				track: track
			};
			try {
				await supertest(server)
					.post('/api/calendar/track/create')
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
			const tracks = await db.Track.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let ids = [];
			tracks.forEach(t => ids.push(t.id) );

			await db.Track.destroy({
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

	it('Creating a track', async () => {
		try {
			const tracks = await db.Track.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			tracks.forEach(track => {
				track.name.should.have.string('Test Track');
				track.country.should.equal('Sweden');
				track.timezone.should.equal('Europe/Amsterdam');
				track.length.should.equal(5);
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating a track with an invalid country', async () => {
		let track = { name: 'Test Track 1', country: 'Swedennn', timezone: 'Europe/Amsterdam', length: 5, map: ''};
		let tmp = {
			track: track
		};
		try {
			await supertest(server)
				.post('/api/calendar/track/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating a track with an invalid timezone', async () => {
		let track = { name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdammmm', length: 5, map: ''};
		let tmp = {
			track: track
		};
		try {
			await supertest(server)
				.post('/api/calendar/track/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating a track', async () => {
		try {
			const tracks = await db.Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				track: {
					name: 'UPDATED_TRACKNAME',
					length: 16
				}
			};

			await supertest(server)
				.post('/api/calendar/track/update/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const track = await db.Track.findOne({
				where: { id: tracks[0].id }
			});
			track.name.should.equal('UPDATED_TRACKNAME');
			track.length.should.equal(16);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating a track with an invalid country', async() => {
		try {
			const tracks = await db.Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				track: {
					name: 'UPDATED_TRACKNAME',
					country: 'Ratel Country',
					length: 16
				}
			};

			await supertest(server)
				.post('/api/calendar/track/update/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating a track with an invalid timezone', async () => {
		try {
			const tracks = await db.Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let tmp = {
				track: {
					name: 'UPDATED_TRACKNAME',
					timezone: 'Europe/Ratel',
					length: 16
				}
			};

			await supertest(server)
				.post('/api/calendar/track/update/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Deleting a track', async () => {
		let nrOfTracksBefore, trackID;
		let tmp = {
			track: {
				name: 'Test Track 6',
				country: 'Sweden',
				timezone: 'Europe/Amsterdam',
				length: 5, map: ''
			}
		};

		try {
			const track = await db.Track.create(tmp);
			trackID = track.id;
			const tracks = await db.Track.findAll();
			nrOfTracksBefore = tracks.length;
			await supertest(server)
				.post('/api/calendar/track/delete/' + trackID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			const response = await db.Track.findAll();
			response.length.should.equal(nrOfTracksBefore - 1);
			response.forEach(t => {
				t.id.should.not.equal(trackID);
			});
		} catch(err) {
			should.not.exist(err);
		}
	});

});
