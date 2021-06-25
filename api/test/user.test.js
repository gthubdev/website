const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const server = require('../index');
const { User } = require('../models/');

describe('User', () => {
	let userid, token;

	// Create user testuser/admin
	beforeEach(async () => {
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
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;
		} catch (err) {
			should.not.exist(err);
		}
	});

	afterEach(async () => {
		try {
			const response = await User.destroy({
				where: { id: userid }
			});
			response.should.equal(1);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user', async () => {
		try {
			const tmp = {
				user: {
					username: 'testuser',
					password: 'someplace',
					name: 'Test User'
				}
			};

			await supertest(server)
				.post('/api/user/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without authorisation', async () => {
		try {
			const tmp = {
				user: {
					username: 'testuser',
					password: 'someplace',
					name: 'Test User'
				}
			};

			await supertest(server)
				.post('/api/user/create')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without username', async () => {
		try {
			const tmp = {
				user: {
					password: 'someplace',
					name: 'Test User'
				}
			};

			await supertest(server)
				.post('/api/user/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without password', async () => {
		try {
			const tmp = {
				user: {
					username: 'someplace',
					name: 'Test User'
				}
			};

			await supertest(server)
				.post('/api/user/create')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a user without name', async () => {
		try {
			const tmp = {
				user: {
					password: 'someplace',
					username: 'testuser'
				}
			};

			await supertest(server)
				.post('/api/user/create')
				.set('Authorization', 'Bearer ' + token)
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
			{ username: 'abc-.', password: 'someplace', name: 'Test User' },
			{ username: 'abc_def', password: 'someplace', name: 'Test User' },
			{ username: 'ABCDEF ', password: 'someplace', name: 'Test User' }
		];
		each(users, async u => {
			const tmp = {
				user: u
			};
			try {
				await supertest(server)
					.post('/api/user/create')
					.set('Authorization', 'Bearer ' + token)
					.send(tmp)
					.expect(422);
			} catch (err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});
});
