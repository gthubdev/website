const request = require('supertest');
describe('Starting express tests', () => {
  let server;
  before(() => {
    server = require('../server');
  });
  after(() => {
    server.close();
  });
  describe('Routes', () => {
    let routes200 = ['/', '/calendar', '/podcast', '/gallery'];

    routes200.forEach(route => {
      describe(route, () => {
        it('Should return 200 on a GET request.', done => {
          describe(route, () => {
            request(server)
              .get(route)
              .expect(200, done);
          });
        });
      });
    });

    let routes302 = ['/test', '/foo', '/package.json'];

    routes302.forEach(route => {
      describe(route, () => {
        it('Should return 302 on a GET request.', done => {
          request(server)
            .get(route)
            .expect(302, done);
        });
      });
    });
  });
});
