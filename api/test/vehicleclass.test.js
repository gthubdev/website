const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const server = require('../index');
const { User, VehicleClassCategory, VehicleClass } = require('../models/');

describe('VehicleClasses', () => {
	let token, cat1ID, cat2ID;

	before(async () => {
		const newuser = {
			username: 'testuser',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testuser',
			email: '',
			usertype_id: 2
		};
		const newcat1 = { name: 'testcat1' };
		const newcat2 = { name: 'testcat2' };
		try {
			await User.create(newuser);
			const cat1 = await VehicleClassCategory.create(newcat1);
			const cat2 = await VehicleClassCategory.create(newcat2);
			cat1ID = cat1.id;
			cat2ID = cat2.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testuser', password: 'admin' })
				.expect(200);

			token = res.body.token;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			await supertest(server)
				.post('/api/auth/logout')
				.set('Authorization', 'Bearer ' + token)
				.send()
				.expect(200);
			await User.destroy({
				where: { }
			});
			await VehicleClassCategory.destroy({
				where: {}
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const classes = [
			{ name: 'TestClass 1', category_id: cat1ID },
			{ name: 'TestClass 2', category_id: cat1ID },
			{ name: 'TestClass 3', category_id: cat1ID },
			{ name: 'TestClass 4', category_id: cat1ID },
			{ name: 'TestClass 5', category_id: cat1ID }
		];
		each(classes, async cl => {
			try {
				await supertest(server)
					.post('/api/vehicleclass')
					.send(cl)
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
			await VehicleClass.destroy({
				where: { }
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a class', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			classes.forEach(cl => {
				cl.name.should.have.string('TestClass');
				cl.category_id.should.equal(cat1ID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a class without data', done => {
		const classes = [
			{ name: 'TestClass 1' },
			{ category_id: cat1ID },
			{ }
		];
		each(classes, async cl => {
			try {
				await supertest(server)
					.post('/api/vehicleclass')
					.send(cl)
					.set('Authorization', 'Bearer ' + token)
					.expect(422);
			} catch (err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating a class with invalid category', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const tmp = { name: 'Testclass', category_id: categories[0].id + 1 };

			await supertest(server)
				.post('/api/vehicleclass')
				.send(tmp)
				.set('Authorization', 'Bearer ' + token)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a class without authorisation', async () => {
		const tmp = {
			name: 'TestClass',
			category_id: cat1ID
		};

		try {
			await supertest(server)
				.post('/api/vehicleclass')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a class with invalid authorisation', async () => {
		const tmp = {
			name: 'TestClass',
			category_id: cat1ID
		};

		try {
			await supertest(server)
				.post('/api/vehicleclass')
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a class', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME',
				category_id: cat2ID
			};

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const cl = await VehicleClass.findByPk(classes[0].id);

			cl.name.should.equal('NEWNAME');
			cl.category_id.should.equal(cat2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a class with empty data', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = { };

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a class with invalid category', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const classes = await VehicleClass.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = { name: 'Test', category_id: categories[0].id + 1 };

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a class without authorisation', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME',
				category_id: cat2ID
			};

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a class with invalid authorisation', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME',
				category_id: cat2ID
			};

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a class', async () => {
		let nrOfClassesBefore, classID;
		const tmp = {
			name: 'testclass123',
			category_id: cat2ID
		};

		try {
			const cl = await VehicleClass.create(tmp);
			classID = cl.id;
			const classes = await VehicleClass.findAll();
			nrOfClassesBefore = classes.length;

			await supertest(server)
				.delete('/api/vehicleclass/' + classID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await VehicleClass.findAll();
			response.length.should.equal(nrOfClassesBefore - 1);
			response.forEach(c => {
				c.id.should.not.equal(classID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a class without authorisation', async () => {
		const tmp = {
			name: 'testclass123',
			category_id: cat2ID
		};

		try {
			const cl = await VehicleClass.create(tmp);

			await supertest(server)
				.delete('/api/vehicleclass/' + cl.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a class with invalid authorisation', async () => {
		const tmp = {
			name: 'testclass123',
			category_id: cat2ID
		};

		try {
			const cl = await VehicleClass.create(tmp);

			await supertest(server)
				.delete('/api/vehicleclass/' + cl.id)
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one class', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 1
			});

			const findOne = await supertest(server)
				.get('/api/vehicleclass/' + classes[0].id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			findOne.body.id.should.equal(classes[0].id);
			findOne.body.name.should.equal(classes[0].name);
			findOne.body.category_id.should.equal(classes[0].category_id);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one class with invalid id', async () => {
		try {
			const classes = await VehicleClass.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/vehicleclass/' + classes[0].id + 1)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			Object.keys(findOne.body).length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all classes', async () => {
		try {
			const classes = await supertest(server)
				.get('/api/vehicleclass')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			classes.body.length.should.equal(5);
			classes.body.forEach(cl => {
				cl.name.should.have.string('TestClass');
				cl.category_id.should.equal(cat1ID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all classes (empty)', async () => {
		try {
			const classes = await VehicleClass.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			classes.forEach(s => ids.push(s.id));

			await VehicleClass.destroy({
				where: { id: ids }
			});

			const res = await supertest(server)
				.get('/api/vehicleclass/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			res.body.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
