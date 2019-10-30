const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const should = require('chai').should();

describe('Authentication', () => {
	let userid, token;

	// Create user testuser/admin
	beforeEach(async () => {
		let newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};

		try {
			const user = await db.User.create(newuser);
			userid = user.id;
		} catch(err) {
			should.not.exist(err);
		}
	});

	afterEach(async () => {
		try {
			const response = await db.User.destroy({
				where: { id: userid }
			});
			response.should.equal(1);
		} catch(err) {
			should.not.exist(err);
		}
	});


	it('Valid login for an admin', async () => {
		try {
			await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Getting profile-info', async () => {
		try {
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;

			const res2 = await supertest(server)
				.get('/api/auth/me')
				.set('Authorization', 'Bearer ' + token)
				.send();
			let user = res2.body;

			user.username.should.have.string('testadmin');
			user.name.should.have.string('Testadmin');
			user.usertype.should.equal(1);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Invalid login', done => {
		supertest(server)
			.post('/api/auth/login')
			.send({ username: 'admin4353', password: 'admin5t6346' })
			.expect(403, done);
	});

	it('Valid logout', async () => {
		try {
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testadmin', password: 'admin' })
				.expect(200);

			token = res.body.token;

			await supertest(server)
				.post('/api/auth/logout')
				.set('Authorization', 'Bearer ' + token)
				.send()
				.expect(200);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Invalid logout', done => {
		supertest(server)
			.post('/api/auth/logout')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.expect(401, done);
	});

	it('Changing password successfully', async () => {
		let newpw =  {
			username: 'testadmin',
			oldpassword: 'admin',
			newpassword: 'newpw'
		};

		try {
			await supertest(server)
				.post('/api/auth/changepassword')
				.set('Authorization', 'Bearer ' + token)
				.send(newpw)
				.expect(200);

			let newpw2 = {
				username: 'testadmin',
				oldpassword: 'newpw',
				newpassword: 'newerpw'
			};

			await supertest(server)
				.post('/api/auth/changepassword')
				.set('Authorization', 'Bearer ' + token)
				.send(newpw2)
				.expect(200);
		} catch(err) {
			should.not.exist(err);
		}
	});

	it('Changing password unsuccessfully', done => {
		let newpw =  {
			username: 'testadmin',
			oldpassword: 'aCSDFAVVSTRBebst',
			newpassword: 'newpw'
		};
		supertest(server)
			.post('/api/auth/changepassword')
			.send(newpw)
			.expect(401, done);
	});

	it('Changing password for non-existent user', done => {
		let newpw =  {
			username: 'testadmin34525624643636325626',
			oldpassword: 'aCSDFAVVSTRBebst',
			newpassword: 'newpw'
		};
		supertest(server)
			.post('/api/auth/changepassword')
			.send(newpw)
			.expect(401, done);
	});
});
