const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { User, VehicleClassCategory } = require('../models/');

describe('VehicleClassCategories', () => {
	let userID, token;

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
			userID = user.id;
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
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const categories = [
			{ name: 'TestCat 1' },
			{ name: 'TestCat 2' },
			{ name: 'TestCat 3' },
			{ name: 'TestCat 4' },
			{ name: 'TestCat 5' }
		];
		each(categories, async cat => {
			try {
				await supertest(server)
					.post('/api/vehiclecategory')
					.send(cat)
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
			const categories = await VehicleClassCategory.findAll();

			const ids = [];
			categories.forEach(c => ids.push(c.id));

			await VehicleClassCategory.destroy({
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

	it('Creating a category', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			categories.forEach(cat => {
				cat.name.should.have.string('TestCat');
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a category', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME'
			};

			await supertest(server)
				.put('/api/vehiclecategory/' + categories[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const cat = await VehicleClassCategory.findByPk(categories[0].id);

			cat.name.should.equal('NEWNAME');
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a category without authorisation', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME'
			};

			await supertest(server)
				.put('/api/vehiclecategory/' + categories[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a category', async () => {
		let nrOfCategoriesBefore, catID;
		const tmp = {
			name: 'testcat123'
		};

		try {
			const cat = await VehicleClassCategory.create(tmp);
			catID = cat.id;
			const categories = await VehicleClassCategory.findAll();
			nrOfCategoriesBefore = categories.length;

			await supertest(server)
				.delete('/api/vehiclecategory/' + catID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await VehicleClassCategory.findAll();
			response.length.should.equal(nrOfCategoriesBefore - 1);
			response.forEach(c => {
				c.id.should.not.equal(catID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a category without authorisation', async () => {
		const tmp = {
			name: 'testcat123'
		};

		try {
			const cat = await VehicleClassCategory.create(tmp);
			await supertest(server)
				.delete('/api/vehiclecategory/' + cat.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
