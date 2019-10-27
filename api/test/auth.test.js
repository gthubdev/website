const supertest = require('supertest');
const server = require('../index');
const db = require('../models/');
const should = require('chai').should();

describe('Authentication', () => {
	let userid, token;
	// Create user testuser/admin
	beforeEach(done => {
		let newuser = {
			username: 'testadmin',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testadmin',
			email: '',
			usertype: 1
		};
		db.User.create(newuser)
		.then(user => {
			userid = user.id;
			done();
		}, err => {
			should.not.exist(err);
			done();
		});
	});
	afterEach(done => {
		db.User.destroy({
			where: { id: userid }
		}).then(response => {
			response.should.equal(1);
			done();
		}, err => {
			should.not.exist(err);
			done();
		});
	});


	it('Valid login for an admin', done => {
		supertest(server)
			.post('/api/auth/login')
			.send({ username: 'testadmin', password: 'admin' })
			.end((err, res) => {
				res.status.should.equal(200);
				should.not.exist(err);
				done();
			}, err => {
				should.not.exist(err);
				done();
			});
	});

	it('Invalid login', done => {
		supertest(server)
			.post('/api/auth/login')
			.send({ username: 'admin4353', password: 'admin5t6346' })
			.expect(403, done);
	});

	it('Valid logout', done => {
		supertest(server)
			.post('/api/auth/login')
			.send({ username: 'testadmin', password: 'admin' })
			.end(async (err, res) => {
				res.status.should.equal(200);
				should.not.exist(err);
				token = res.body.token;
				supertest(server)
					.post('/api/auth/logout')
					.set('Authorization', 'Bearer ' + token)
					.send()
					.expect(200, done);
			}, err => {
				should.not.exist(err);
				done();
			});
	});

	it('Invalid logout', done => {
		supertest(server)
			.post('/api/auth/logout')
			.set('Authorization', 'Bearer ' + token)
			.send()
			.expect(401, done);
	});

	it('Changing password successfully', done => {
		let newpw =  {
			username: 'testadmin',
			oldpassword: 'admin',
			newpassword: 'newpw'
		};
		supertest(server)
			.post('/api/auth/changepassword')
			.send(newpw)
			.end((err, res) => {
				res.status.should.equal(200);
				should.not.exist(err);
				let newpw2 = {
					username: 'testadmin',
					oldpassword: 'newpw',
					newpassword: 'newerpw'
				};
				supertest(server)
					.post('/api/auth/changepassword')
					.send(newpw2)
					.expect(200, done);
			}, err => {
				should.not.exist(err);
				done();
			});
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
