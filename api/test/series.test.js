const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { Series, SeriesType, User, VehicleClass, VehicleClassCategory } = require('../models/');

describe('Series', () => {
	let vclCatId, vclId;
	let token;

	before(async () => {
		const newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype_id: 1
		};
		const tmp1 = {
			name: 'Test Vehicle Class Category'
		};

		try {
			await User.create(newuser);
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;

			const vclCat = await VehicleClassCategory.create(tmp1);

			vclCatId = vclCat.id;
			const tmp2 = {
				name: 'Test Vehicle Class',
				category_id: vclCatId
			};

			const vcl = await VehicleClass.create(tmp2);
			vclId = vcl.id;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			await User.destroy({
				where: { }
			});

			await SeriesType.destroy({
				where: { }
			});

			await VehicleClass.destroy({
				where: { }
			});

			await VehicleClassCategory.destroy({
				where: { }
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const series = [
			{ name: 'Test Series 1', shortname: 'TS1', priority: 1 },
			{ name: 'Test Series 2', shortname: 'TS2', priority: 1 },
			{ name: 'Test Series 3', shortname: 'TS3', priority: 1 },
			{ name: 'Test Series 4', shortname: 'TS4', priority: 1 },
			{ name: 'Test Series 5', shortname: 'TS5', priority: 1 }
		];
		each(series, async s => {
			// Need this, because the controller is parsing req.body.series
			s.vehicleClasses = [vclId];
			try {
				await supertest(server)
					.post('/api/series')
					.set('Authorization', 'Bearer ' + token)
					.send(s)
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
			const series = await Series.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			series.forEach(s => ids.push(s.id));

			await Series.destroy({
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

	it('Creating a series', async () => {
		try {
			const series = await Series.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			series.forEach(s => {
				s.name.should.have.string('Test Series');
				s.shortname.should.have.string('TS');
				s.priority.should.equal(1);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a series without authorisation', async () => {
		const tmp = { name: 'Test Series 1', shortname: 'TS1', priority: 1 };

		try {
			await supertest(server)
				.post('/api/series')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a series with an invalid priority', async () => {
		const tmp = { name: 'Test Series 1', shortname: 'TS1', priority: -2 };
		tmp.vehicleClasses = [vclId];
		try {
			await supertest(server)
				.post('/api/series')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a series', async () => {
		try {
			const series = await Series.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			const vehicleClasses = [vclId];
			const tmp = {
				id: series[0].id,
				name: 'NEW_SERIES_NAME',
				priority: 2,
				vehicleClasses
			};

			await supertest(server)
				.put('/api/series/' + series[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const s = await Series.findOne({
				where: { id: series[0].id },
				include: [
					{ model: SeriesType }
				]
			});
			s.name.should.equal('NEW_SERIES_NAME');
			s.priority.should.equal(2);
			s.SeriesTypes[0].class_id.should.equal(vclId);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a series without authorisation', async () => {
		try {
			const series = await Series.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			const vehicleClasses = [vclId];
			const tmp = {
				id: series[0].id,
				name: 'NEW_SERIES_NAME',
				priority: 2,
				vehicleClasses
			};

			await supertest(server)
				.put('/api/series/' + series[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a series with an invalid priority', async () => {
		try {
			const series = await Series.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			const vehicleClasses = [vclId];
			const tmp = {
				id: series[0].id,
				name: 'NEW_SERIES_NAME',
				priority: 20,
				vehicleClasses
			};
			await supertest(server)
				.put('/api/series/' + series[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a series', async () => {
		let nrOfSeriesBefore, seriesID;
		const tmp = {
			name: 'Test Series 6',
			shortname: 'TS6',
			priority: 1,
			vehicleClasses: [vclId]
		};

		try {
			const newseries = await Series.create(tmp);
			seriesID = newseries.id;

			const series = await Series.findAll();
			nrOfSeriesBefore = series.length;
			await supertest(server)
				.delete('/api/series/' + seriesID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await Series.findAll();
			response.length.should.equal(nrOfSeriesBefore - 1);
			response.forEach(s => s.id.should.not.equal(seriesID));
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a series without authorisation', async () => {
		const tmp = {
			name: 'Test Series 6',
			shortname: 'TS6',
			priority: 1,
			vehicleClasses: [vclId]
		};

		try {
			const newseries = await Series.create(tmp);
			await supertest(server)
				.delete('/api/series/' + newseries.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one series', async () => {
		try {
			const series = await Series.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/series/' + series[0].id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			findOne.body.id.should.equal(series[0].id);
			findOne.body.name.should.equal(series[0].name);
			findOne.body.shortname.should.equal(series[0].shortname);
			findOne.body.priority.should.equal(series[0].priority);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one series with invalid id', async () => {
		try {
			const series = await Series.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/series/' + (series[0].id + 1))
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			Object.keys(findOne.body).length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all series', async () => {
		try {
			const series = await supertest(server)
				.get('/api/series/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			series.body.length.should.equal(5);
			series.body.forEach(s => {
				s.name.should.have.string('Test Series');
				s.shortname.should.have.string('TS');
				s.priority.should.equal(1);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all series (empty)', async () => {
		try {
			const series = await Series.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			series.forEach(s => ids.push(s.id));

			await Series.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
			});

			const res = await supertest(server)
				.get('/api/series/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			res.body.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
