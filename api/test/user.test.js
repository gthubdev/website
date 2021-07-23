const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { User } = require('../models/');

describe('User', () => {
	let admintoken, user1id, user1token, user2id, user2token;

	// Create user testuser/admin
	before(async () => {
		const users = [
			{
				username: 'testadmin',
				password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
				name: 'Testadmin',
				email: '',
				usertype_id: 1
			},
			{
				username: 'testuser1',
				password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
				name: 'Testuser1',
				email: '',
				usertype_id: 2
			},
			{
				username: 'testuser2',
				password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
				name: 'Testuser2',
				email: '',
				usertype_id: 2
			}
		];

		try {
			await User.create(users[0]);
			let res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			admintoken = res.body.token;

			let user = await User.create(users[1]);
			user1id = user.id;
			res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testuser1', password: 'admin' })
				.expect(200);

			user1token = res.body.token;

			user = await User.create(users[2]);
			user2id = user.id;
			res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testuser2', password: 'admin' })
				.expect(200);

			user2token = res.body.token;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			const users = await User.findAll();

			const ids = [];
			users.forEach(u => ids.push(u.id));

			await User.destroy({
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

	it('Creating a user', async () => {
		try {
			const tmp = {
				username: 'testuser',
				password: 'someplace',
				name: 'Test User'
			};

			await supertest(server)
				.post('/api/users')
				.set('Authorization', 'Bearer ' + admintoken)
				.send(tmp)
				.expect(200);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without authorisation', async () => {
		try {
			const tmp = {
				username: 'testuser',
				password: 'someplace',
				name: 'Test User'
			};

			await supertest(server)
				.post('/api/users')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without username', async () => {
		try {
			const tmp = {

				password: 'someplace',
				name: 'Test User'

			};

			await supertest(server)
				.post('/api/users')
				.set('Authorization', 'Bearer ' + admintoken)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without password', async () => {
		try {
			const tmp = {
				username: 'someplace',
				name: 'Test User'
			};

			await supertest(server)
				.post('/api/users')
				.set('Authorization', 'Bearer ' + admintoken)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without name', async () => {
		try {
			const tmp = {
				password: 'someplace',
				username: 'testuser'
			};

			await supertest(server)
				.post('/api/users')
				.set('Authorization', 'Bearer ' + admintoken)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user with invalid username', done => {
		const users = [
			{ username: 'a bcdef', password: 'someplace', name: 'Test User' },
			{ username: 'ab', password: 'someplace', name: 'Test User' },
			{ username: 'abcdefghijklmnopqrstuvwxyz', password: 'someplace', name: 'Test User' },
			{ username: 'delta_one', password: 'someplace', name: 'Test User' },
			{ username: 'abc_def', password: 'someplace', name: 'Test User' },
			{ username: '-abcdef', password: 'someplace', name: 'Test User' },
			{ username: 'abcdef-', password: 'someplace', name: 'Test User' },
			{ username: 'ab-cd-ef', password: 'someplace', name: 'Test User' },
			{ username: 'abc--def', password: 'someplace', name: 'Test User' },
			{ username: 'ABCDEF ', password: 'someplace', name: 'Test User' }
		];
		each(users, async u => {
			try {
				await supertest(server)
					.post('/api/users')
					.set('Authorization', 'Bearer ' + admintoken)
					.send(u)
					.expect(422);
			} catch (err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating a user with a username already in use', async () => {
		const tmp = {
			username: 'testadmin',
			password: 'somepass',
			name: 'Test User'
		};

		try {
			await supertest(server)
				.post('/api/users')
				.set('Authorization', 'Bearer ' + admintoken)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a user', async () => {
		const tmp = {
			name: 'newname',
			email: 'new@example.com'
		};

		try {
			await supertest(server)
				.put('/api/users/' + user1id)
				.set('Authorization', 'Bearer ' + user1token)
				.send(tmp)
				.expect(200);

			const u = await User.findOne({
				where: { id: user1id }
			});
			u.name.should.equal('newname');
			u.email.should.equal('new@example.com');
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a user as admin', async () => {
		const tmp = {
			name: 'newname123',
			email: 'new@example.com'
		};

		try {
			await supertest(server)
				.put('/api/users/' + user2id)
				.set('Authorization', 'Bearer ' + admintoken)
				.send(tmp)
				.expect(200);

			const u = await User.findOne({
				where: { id: user2id }
			});
			u.name.should.equal('newname123');
			u.email.should.equal('new@example.com');
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a user without authorisation', async () => {
		const tmp = {
			name: 'newname',
			email: 'new@example.com'
		};

		try {
			await supertest(server)
				.put('/api/users/' + user1id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a user with wrong authentication', async () => {
		const tmp = {
			name: 'newname',
			email: 'new@example.com'
		};

		try {
			await supertest(server)
				.put('/api/users/' + user1id)
				.set('Authorization', 'Bearer ' + user2token)
				.send(tmp)
				.expect(403);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a username', async () => {
		const tmp = {
			username: 'newusername'
		};

		try {
			await supertest(server)
				.put('/api/users/' + user1id)
				.set('Authorization', 'Bearer ' + user1token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a password', async () => {
		const tmp = {
			password: 'newpass'
		};

		try {
			await supertest(server)
				.put('/api/users/' + user1id)
				.set('Authorization', 'Bearer ' + user1token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a usertype', async () => {
		const tmp = {
			usertype: 1
		};

		try {
			await supertest(server)
				.put('/api/users/' + user1id)
				.set('Authorization', 'Bearer ' + user1token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a user', async () => {
		try {
			const users_before = await User.findAll({
				where: { deleted: 0 }
			});

			users_before.should.have.a.lengthOf.at.least(2);

			await supertest(server)
				.delete('/api/users/' + users_before[1].id)
				.set('Authorization', 'Bearer ' + admintoken)
				.expect(200);

			const users_after = await User.findAll({
				where: { deleted: 0 }
			});

			users_before.length.should.equal(users_after.length + 1);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a user without authorisation', async () => {
		try {
			const users_before = await User.findAll({
				where: { deleted: 0 }
			});

			users_before.should.have.a.lengthOf.at.least(2);

			await supertest(server)
				.delete('/api/users/' + users_before[1].id)
				.set('Authorization', 'Bearer ' + user2token)
				.expect(403);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a non-existent user', async () => {
		try {
			const users_before = await User.findAll({
				where: { deleted: 0 },
				order: [
					['id', 'DESC']
				]
			});

			const tmp = users_before[users_before.length - 1].id + 1;

			users_before.should.have.a.lengthOf.at.least(2);

			await supertest(server)
				.delete('/api/users/' + tmp)
				.set('Authorization', 'Bearer ' + admintoken)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
