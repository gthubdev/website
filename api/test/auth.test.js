const supertest = require('supertest');
const server = require('../index');

const should = require('chai').should();

describe('Authentication', () => {
	it('Valid login for an admin', done => {
		supertest(server)
			.post('/api/login')
			.send({ username: 'admin', password: 'admin' })
			.expect(200, done);
			// .end((err, res) => {
			// 	should.not.exist(err);
			// 	// res.headers.location.substring(0, 6).should.not.equal('/api/error');
			// 	done();
			// });
	});

	it('Invalid login', done => {
		supertest(server)
			.post('/api/login')
			.send({ username: 'admin4353', password: 'admin5t6346' })
			.expect(403, done);
			// .end((err, res) => {
			// 	should.not.exist(err);
			// 	res.headers.location.substring(0, 6).should.equal('/api/error');
			// 	done();
			// });
	});

	it('Logout', done => {
		supertest(server)
			.post('/api/logout')
			.send()
			.expect(200, done);
			// .end((err, res) => {
			// 	should.not.exist(err);
			// 	done();
			// });
	});
});
