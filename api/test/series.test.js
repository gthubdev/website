// const supertest = require('supertest');
// const server = require('../index');
// const db = require('../models/');
// const each = require('async/each');
// const should = require('chai').should();
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
//
// describe('Series', () => {
// 	let vcl_cat_id, vcl_id;
//
// 	before(done => {
// 		let tmp1 = {
// 			name: 'Test Vehicle Class Category'
// 		};
// 		db.VehicleClassCategory.create(tmp1)
// 		.then(vcl_cat => {
// 			vcl_cat_id = vcl_cat.id;
// 			let tmp2 = {
// 				name: 'Test Vehicle Class',
// 				category: vcl_cat_id
// 			};
// 			db.VehicleClass.create(tmp2)
// 			.then(vcl => {
// 				vcl_id = vcl.id;
// 				done();
// 			}, err => {
// 				should.not.exist(err);
// 				done();
// 			});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	after(done => {
// 		db.VehicleClass.destroy({
// 			where: { id: vcl_id }
// 		}).then(res1 => {
// 			res1.should.equal(1);
// 			db.VehicleClassCategory.destroy({
// 				where: { id: vcl_cat_id }
// 			}).then(res2 => {
// 				res2.should.equal(1);
// 				done();
// 			}, err => {
// 				should.not.exist(err);
// 				done();
// 			});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	beforeEach(done => {
// 		let series = [
// 			{ name: 'Test Series 1', shortname: 'TS1', priority: 1},
// 			{ name: 'Test Series 2', shortname: 'TS2', priority: 1},
// 			{ name: 'Test Series 3', shortname: 'TS3', priority: 1},
// 			{ name: 'Test Series 4', shortname: 'TS4', priority: 1},
// 			{ name: 'Test Series 5', shortname: 'TS5', priority: 1},
// 		];
// 		each(series, function(s, callback) {
// 			// Need this, because the controller is parsing req.body.series
// 			let vehicleClasses = [];
// 			vehicleClasses.push({id: vcl_id});
// 			s.vehicleClasses = vehicleClasses;
// 			let tmp = {
// 				series : s
// 			};
// 			supertest(server)
// 				.post('/api/calendar/series/create')
// 				.send(tmp)
// 				.end((err, res) => {
// 					res.status.should.equal(200);
// 					should.not.exist(err);
// 					callback();
// 				});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	afterEach(done => {
// 		db.Series.findAll({
// 			limit: 5,
// 			order: [
// 				['createdAt', 'DESC'],
// 				['id', 'DESC']
// 			]
// 		}).then(series => {
// 			let ids = [];
// 			series.forEach(s => ids.push(s.id) );
// 			db.Series.destroy({
// 				where: {
// 					id: {
// 						[Op.in]: ids
// 					}
// 				}
// 			}).then(() => {
// 				done();
// 			});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	it('Creating a series', done => {
// 		db.Series.findAll({
// 			limit: 5,
// 			order: [
// 				['createdAt', 'DESC'],
// 				['id', 'DESC']
// 			]
// 		}).then(series => {
// 			series.forEach(s => {
// 				s.name.should.have.string('Test Series');
// 				s.shortname.should.have.string('TS');
// 				s.priority.should.equal(1);
// 			});
// 			done();
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	it('Creating a series with an invalid priority', done => {
// 		let series = { name: 'Test Series 1', shortname: 'TS1', priority: -2};
// 		let tmp = {
// 			series: series,
// 			vehicleClasses: [
// 				{ id: vcl_id }
// 			]
// 		};
// 		supertest(server)
// 				.post('/api/calendar/series/create')
// 				.send(tmp)
// 				.end((err, res) => {
// 					res.status.should.equal(400);
// 					should.not.exist(err);
// 					done();
// 				});
// 	});
//
// 	it('Updating a series', done => {
// 		db.Series.findAll({
// 			limit: 1,
// 			order: [
// 				['createdAt', 'DESC'],
// 				['id', 'DESC']
// 			]
// 		}).then(series => {
// 			let vehicleClasses = [];
// 			vehicleClasses.push({id: vcl_id});
// 			let tmp = {
// 				series: {
// 					id: series[0].id,
// 					name: 'NEW_SERIES_NAME',
// 					priority: 2,
// 					vehicleClasses: vehicleClasses
// 				}
// 			};
// 			supertest(server)
// 				.post('/api/calendar/series/update/' + series[0].id)
// 				.send(tmp)
// 				.end((err, res) => {
// 					res.status.should.equal(200);
// 					should.not.exist(err);
// 					db.Series.findOne({
// 						where: { id: series[0].id },
// 						include: [
// 							{ model: db.SeriesType }
// 						]
// 					}).then(s => {
// 						s.name.should.equal('NEW_SERIES_NAME');
// 						s.priority.should.equal(2);
// 						s.SeriesTypes[0].class.should.equal(vcl_id);
// 						done();
// 					}, err => {
// 						should.not.exist(err);
// 						done();
// 					});
// 				});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	it('Updating a series with an invalid priority', done => {
// 		db.Series.findAll({
// 			limit: 1,
// 			order: [
// 				['createdAt', 'DESC'],
// 				['id', 'DESC']
// 			]
// 		}).then(series => {
// 			let vehicleClasses = [];
// 			vehicleClasses.push({id: vcl_id});
// 			let tmp = {
// 				series: {
// 					id: series[0].id,
// 					name: 'NEW_SERIES_NAME',
// 					priority: 20,
// 					vehicleClasses: vehicleClasses
// 				}
// 			};
// 			supertest(server)
// 				.post('/api/calendar/series/update/' + series[0].id)
// 				.send(tmp)
// 				.end((err, res) => {
// 					res.status.should.equal(400);
// 					should.not.exist(err);
// 					done();
// 				});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
//
// 	it('Deleting a series', done => {
// 		let nrOfSeriesBefore, seriesID;
// 		let tmp = {
// 			name: 'Test Series 6',
// 			shortname: 'TS6',
// 			priority: 1,
// 			vehicleClasses: [
// 				{ id: vcl_id }
// 			]
// 		};
// 		db.Series.create(tmp)
// 		.then(newseries => {
// 			seriesID = newseries.id;
// 			db.Series.findAll()
// 			.then(series => {
// 				nrOfSeriesBefore = series.length;
// 				supertest(server)
// 					.post('/api/calendar/series/delete/' + seriesID)
// 					.end((err, res) => {
// 						res.status.should.equal(200);
// 						should.not.exist(err);
// 						db.Series.findAll()
// 						.then(response => {
// 							response.length.should.equal(nrOfSeriesBefore - 1);
// 							response.forEach(s => s.id.should.not.equal(seriesID));
// 							done();
// 						}, err => {
// 							should.not.exist(err);
// 							done();
// 						});
// 					});
// 			}, err => {
// 				should.not.exist(err);
// 				done();
// 			});
// 		}, err => {
// 			should.not.exist(err);
// 			done();
// 		});
// 	});
// });
