const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const server = require('../index');
const { User, VehicleClassCategory } = require('../models/');

describe('VehicleClassCategories', () => {
	let token;

	before(async () => {
		const newuser = {
			username: 'testuser',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testuser',
			email: '',
			usertype: 2
		};
		try {
			await User.create(newuser);
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
			await VehicleClassCategory.destroy({
				where: { }
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

	it('Creating a category without data', done => {
		const category = [
			{ }
		];
		each(category, async cl => {
			try {
				await supertest(server)
					.post('/api/vehiclecategory')
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

	it('Creating a category without authorisation', async () => {
		const tmp = { name: 'Testcat' };

		try {
			await supertest(server)
				.post('/api/vehiclecategory')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a category with invalid authorisation', async () => {
		const tmp = { name: 'Testcat' };

		try {
			await supertest(server)
				.post('/api/vehiclecategory')
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.send(tmp)
				.expect(401);
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

	it('Updating a class with empty data', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = { };

			await supertest(server)
				.put('/api/vehiclecategory/' + categories[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
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

	it('Updating a category with invalid authorisation', async () => {
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
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
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

	it('Deleting a category without authorisation', async () => {
		const tmp = {
			name: 'testcat123'
		};

		try {
			const cat = await VehicleClassCategory.create(tmp);
			await supertest(server)
				.delete('/api/vehiclecategory/' + cat.id)
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one category', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1
			});

			const findOne = await supertest(server)
				.get('/api/vehiclecategory/' + categories[0].id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			findOne.body.id.should.equal(categories[0].id);
			findOne.body.name.should.equal(categories[0].name);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one category with invalid id', async () => {
		try {
			const categories = await VehicleClassCategory.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/vehiclecategory/' + categories[0].id + 1)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			Object.keys(findOne.body).length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all categories', async () => {
		try {
			const categories = await supertest(server)
				.get('/api/vehiclecategory')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			categories.body.length.should.equal(5);
			categories.body.forEach(cl => {
				cl.name.should.have.string('TestCat');
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all categories (empty)', async () => {
		try {
			const classes = await VehicleClassCategory.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			classes.forEach(s => ids.push(s.id));

			await VehicleClassCategory.destroy({
				where: { id: ids }
			});

			const res = await supertest(server)
				.get('/api/vehiclecategory/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			res.body.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
