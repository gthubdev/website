const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { User, Track } = require('../models/');

describe('Tracks', () => {
	let userid, token;
	// Create user testuser/admin
	before(async () => {
		const newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		try {
			const user = await User.create(newuser);
			userid = user.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' });

			token = res.body.token;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		const response = await User.destroy({
			where: { id: userid }
		});
		response.should.equal(1);
	});

	beforeEach(done => {
		const tracks = [
			{ name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' },
			{ name: 'Test Track 2', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' },
			{ name: 'Test Track 3', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' },
			{ name: 'Test Track 4', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' },
			{ name: 'Test Track 5', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' }
		];
		each(tracks, async track => {
			try {
				await supertest(server)
					.post('/api/track')
					.set('Authorization', 'Bearer ' + token)
					.send(track)
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
			const tracks = await Track.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			tracks.forEach(t => ids.push(t.id));

			await Track.destroy({
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

	it('Creating a track', async () => {
		try {
			const tracks = await Track.findAll({
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
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a track without authorisation', async () => {
		const tmp = { name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdam', length: 5, map: '' };

		try {
			await supertest(server)
				.post('/api/track')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a track with an invalid country', async () => {
		const track = { name: 'Test Track 1', country: 'Swedennn', timezone: 'Europe/Amsterdam', length: 5, map: '' };
		try {
			await supertest(server)
				.post('/api/track')
				.set('Authorization', 'Bearer ' + token)
				.send(track)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a track with an invalid timezone', async () => {
		const track = { name: 'Test Track 1', country: 'Sweden', timezone: 'Europe/Amsterdammmm', length: 5, map: '' };
		try {
			await supertest(server)
				.post('/api/track')
				.set('Authorization', 'Bearer ' + token)
				.send(track)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a track', async () => {
		try {
			const tracks = await Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_TRACKNAME',
				length: 16
			};

			await supertest(server)
				.put('/api/track/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const track = await Track.findOne({
				where: { id: tracks[0].id }
			});
			track.name.should.equal('UPDATED_TRACKNAME');
			track.length.should.equal(16);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a track without authorisation', async () => {
		try {
			const tracks = await Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_TRACKNAME',
				length: 16
			};

			await supertest(server)
				.put('/api/track/' + tracks[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a track with an invalid country', async () => {
		try {
			const tracks = await Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_TRACKNAME',
				country: 'Ratel Country',
				length: 16
			};

			await supertest(server)
				.put('/api/track/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a track with an invalid timezone', async () => {
		try {
			const tracks = await Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'UPDATED_TRACKNAME',
				timezone: 'Europe/Ratel',
				length: 16
			};

			await supertest(server)
				.put('/api/track/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a track', async () => {
		let nrOfTracksBefore, trackID;
		const tmp = {
			name: 'Test Track 6',
			country: 'Sweden',
			timezone: 'Europe/Amsterdam',
			length: 5,
			map: ''
		};

		try {
			const track = await Track.create(tmp);
			trackID = track.id;
			const tracks = await Track.findAll();
			nrOfTracksBefore = tracks.length;
			await supertest(server)
				.delete('/api/track/' + trackID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			const response = await Track.findAll();
			response.length.should.equal(nrOfTracksBefore - 1);
			response.forEach(t => {
				t.id.should.not.equal(trackID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a track without authorisation', async () => {
		const tmp = {
			name: 'Test Track 6',
			country: 'Sweden',
			timezone: 'Europe/Amsterdam',
			length: 5,
			map: ''
		};

		try {
			const track = await Track.create(tmp);
			await supertest(server)
				.delete('/api/track/' + track.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one track', async () => {
		try {
			const tracks = await Track.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/track/' + tracks[0].id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			findOne.body.id.should.equal(tracks[0].id);
			findOne.body.name.should.equal(tracks[0].name);
			findOne.body.country.should.equal(tracks[0].country);
			findOne.body.timezone.should.equal(tracks[0].timezone);
			findOne.body.length.should.equal(tracks[0].length);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one track with invalid id', async () => {
		try {
			const tracks = await Track.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/track/' + (tracks[0].id + 1))
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			Object.keys(findOne.body).length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all tracks', async () => {
		try {
			const tracks = await supertest(server)
				.get('/api/track/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			tracks.body.length.should.equal(5);
			tracks.body.forEach(track => {
				track.name.should.have.string('Test Track');
				track.country.should.equal('Sweden');
				track.timezone.should.equal('Europe/Amsterdam');
				track.length.should.equal(5);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all tracks (empty)', async () => {
		try {
			const tracks = await Track.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			tracks.forEach(s => ids.push(s.id));

			await Track.destroy({
				where: { id: ids }
			});

			const res = await supertest(server)
				.get('/api/track/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			res.body.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
