const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { User, VehicleClassCategory, VehicleClass } = require('../models/');

describe('VehicleClasses', () => {
	let userID, token, cat1ID, cat2ID;

	before(async () => {
		const newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		const newcat1 = { name: 'testcat1' };
		const newcat2 = { name: 'testcat2' };
		try {
			const user = await User.create(newuser);
			const cat1 = await VehicleClassCategory.create(newcat1);
			const cat2 = await VehicleClassCategory.create(newcat2);
			userID = user.id;
			cat1ID = cat1.id;
			cat2ID = cat2.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			const response = await User.destroy({
				where: { id: userID }
			});
			response.should.equal(1);
			await VehicleClassCategory.destroy({
				where: {}
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const classes = [
			{ name: 'TestClass 1', category: cat1ID },
			{ name: 'TestClass 2', category: cat1ID },
			{ name: 'TestClass 3', category: cat1ID },
			{ name: 'TestClass 4', category: cat1ID },
			{ name: 'TestClass 5', category: cat1ID }
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
			const classes = await VehicleClass.findAll();

			const ids = [];
			classes.forEach(c => ids.push(c.id));

			await VehicleClass.destroy({
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
				cl.category.should.equal(cat1ID);
			});
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
				category: cat2ID
			};

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const cl = await VehicleClass.findByPk(classes[0].id);

			cl.name.should.equal('NEWNAME');
			cl.category.should.equal(cat2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a class without auhtorisation', async () => {
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
				category: cat2ID
			};

			await supertest(server)
				.put('/api/vehicleclass/' + classes[0].id)
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
			category: cat2ID
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

	it('Deleting a class', async () => {
		const tmp = {
			name: 'testclass123',
			category: cat2ID
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
});
