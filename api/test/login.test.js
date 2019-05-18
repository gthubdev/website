const supertest = require('supertest');
const server = require('../../server/index');

const should = require('chai').should();

describe('Testing the login- and logout-function', () => {
	it('Valid login for an admin', done => {
		supertest(server)
			.post('api/login')
			.send({ username: 'admin', password: 'admin' })
			.end((err, res) => {
				should.not.exist(err);
				res.headers.location.substring(0, 6).should.not.equal('api/error');
				done();
			});
	});

	it('Invalid login', done => {
		supertest(server)
			.post('api/login')
			.send({ username: 'admin4353', password: 'admin5t6346' })
			.end((err, res) => {
				should.not.exist(err);
				res.headers.location.substring(0, 6).should.equal('api/error');
				done();
			});
	});

	it('Sending logout-request', done => {
		supertest(server)
			.post('api/logout')
			.send()
			.end((err, res) => {
				should.not.exist(err);
				done();
			});
	});
});
