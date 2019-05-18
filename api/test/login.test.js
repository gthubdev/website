const supertest = require('supertest');
const server = require('../server');

const should = require('chai').should();

describe('Testing the login- and logout-function', () => {
	it('Valid login for an admin', done => {
		supertest(server)
		.post('/login')
		.send({username: 'admin', password: 'admin'})
		.end((err, res) => {
			should.not.exist(err);
			res.headers.location.substring(0,6).should.not.equal('/error');
			done();
		});
	});

	it('Invalid login', done => {
		supertest(server)
		.post('/login')
		.send({username: 'admin4353', password: 'admin5t6346'})
		.end((err, res) => {
			should.not.exist(err);
			res.headers.location.substring(0,6).should.equal('/error');
			done();
		});
	});

	it('Sending logout-request', done => {
		supertest(server)
		.post('/logout')
		.send()
		.end((err, res) => {
			should.not.exist(err);
			done();
		});
	});
});
