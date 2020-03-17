const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

describe('Series', () => {
	let vcl_cat_id, vcl_id;
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

			const res2 = await db.VehicleClassCategory.destroy({
				where: { id: vcl_cat_id }
			});
			res2.should.equal(1);
		} catch(err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		let series = [
			{ name: 'Test Series 1', shortname: 'TS1', priority: 1},
			{ name: 'Test Series 2', shortname: 'TS2', priority: 1},
			{ name: 'Test Series 3', shortname: 'TS3', priority: 1},
			{ name: 'Test Series 4', shortname: 'TS4', priority: 1},
			{ name: 'Test Series 5', shortname: 'TS5', priority: 1},
		];
		each(series, async (s) => {
			// Need this, because the controller is parsing req.body.series
			s.vehicleClasses = [ vcl_id ];
			let tmp = {
				series : s
			};
			try {
				await supertest(server)
					.post('/api/calendar/series/create')
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
			const series = await db.Series.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			let ids = [];
			series.forEach(s => ids.push(s.id) );

			await db.Series.destroy({
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

	it('Creating a series', async () => {
		try {
			const series = await db.Series.findAll({
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
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Creating a series with an invalid priority', async () => {
		let series = { name: 'Test Series 1', shortname: 'TS1', priority: -2};
		let tmp = {
			series: series,
			vehicleClasses: [ vcl_id ]
		};
		try {
			await supertest(server)
				.post('/api/calendar/series/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating a series', async () => {
		try {
			const series = await db.Series.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			let vehicleClasses = [ vcl_id ];
			let tmp = {
				series: {
					id: series[0].id,
					name: 'NEW_SERIES_NAME',
					priority: 2,
					vehicleClasses: vehicleClasses
				}
			};

			await supertest(server)
				.post('/api/calendar/series/update/' + series[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const s = await db.Series.findOne({
				where: { id: series[0].id },
				include: [
					{ model: db.SeriesType }
				]
			});
			s.name.should.equal('NEW_SERIES_NAME');
			s.priority.should.equal(2);
			s.SeriesTypes[0].class.should.equal(vcl_id);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Updating a series with an invalid priority', async () => {
		try {
			const series = await db.Series.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			let vehicleClasses = [ vcl_id ];
			let tmp = {
				series: {
					id: series[0].id,
					name: 'NEW_SERIES_NAME',
					priority: 20,
					vehicleClasses: vehicleClasses
				}
			};
			await supertest(server)
				.post('/api/calendar/series/update/' + series[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(400);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Deleting a series', async () => {
		let nrOfSeriesBefore, seriesID;
		let tmp = {
			name: 'Test Series 6',
			shortname: 'TS6',
			priority: 1,
			vehicleClasses: [ vcl_id ]
		};

		try {
			const newseries = await db.Series.create(tmp);
			seriesID = newseries.id;

			const series = await db.Series.findAll();
			nrOfSeriesBefore = series.length;
			await supertest(server)
				.post('/api/calendar/series/delete/' + seriesID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await db.Series.findAll();
			response.length.should.equal(nrOfSeriesBefore - 1);
			response.forEach(s => s.id.should.not.equal(seriesID));
		} catch(err) {
			should.not.exist(err);
		}
	});
});
