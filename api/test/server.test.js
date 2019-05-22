const request = require('supertest');

describe('Testing routes', () => {
	let server;
	before(() => {
		server = require('../index');
	});
	after(() => {
		server.close();
	});
	// describe('', () => {
	// let routes200 = ['api/', 'api/calendar', 'api/podcast', 'api/gallery'];
	let routes200 = ['/api/calendar'];

	routes200.forEach(route => {
		it('Should return 200 on a GET request.', (done) => {
			describe(route, () => {
				request(server)
					.get(route)
					.expect(200, done);
			});
		});
	});

	// let routes404 = ['api/test', 'api/foo', 'api/package.json'];
	let routes404 = [];

	routes404.forEach(route => {
		describe(route, () => {
			it('Should return 302 on a GET request.', (done) => {
				request(server)
					.get(route)
					.expect(302, done);
			});
		});
	});
	// });
});
