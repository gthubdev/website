const request = require('supertest');
describe('Starting database tests', () => {
  let server;
  before(() => {
    server = require('../server');
  });
  after(() => {
    server.close();
  });
  describe('Requests', () => {
    describe('Events', () => {
      let eventRequests = [
        '/calendar/events?name=3-hours-of-daytona',
        '/calendar/events?date=2019-02-22',
        '/calendar/events?serie=tcr-middle-east',
        '/calendar/events?track=yas-marina'
      ];
      eventRequests.forEach(route => {
        describe(route, () => {
          it('Should return json on a GET request.', done => {
            request(server)
              .get(route)
              .expect('Content-type', /application\/json/)
              .expect(200, done);
          });
        });
      });
    });

    describe('Series', () => {
      describe('/calendar/series?name=24h-prototype-series', () => {
        it('Should return json on a GET request.', done => {
          request(server)
            .get('/calendar/series?name=24h-prototype-series')
            .expect('Content-type', /application\/json/)
            .expect(200, done);
        });
      });

      describe('/calendar/series?name=24h', () => {
        it('Should return 404 on a GET request.', done => {
          request(server)
            .get('/calendar/series?name=24h')
            .expect(404, done);
        });
      });
    });

    describe('Tracks', () => {
      describe('/calendar/tracks?name=yas-marina', () => {
        it('Should return json on a GET request.', done => {
          request(server)
            .get('/calendar/tracks?name=yas-marina')
            .expect('Content-type', /application\/json/)
            .expect(200, done);
        });
      });

      describe('/calendar/tracks?name=yas-marina', () => {
        it('Should return json on a GET request.', done => {
          request(server)
            .get('/calendar/tracks?name=yas-marina')
            .expect('Content-type', /application\/json/)
            .expect(200, done);
        });
      });

      describe('/calendar/tracks?country=usa', () => {
        it('Should return json on a GET request.', done => {
          request(server)
            .get('/calendar/tracks?name=yas-marina')
            .expect('Content-type', /application\/json/)
            .expect(200, done);
        });
      });

      describe('/calendar/series?name=yas', () => {
        it('Should return 404 on a GET request.', done => {
          request(server)
            .get('/calendar/tracks?name=24h')
            .expect(404, done);
        });
      });

      describe('/calendar/series?country=foo', () => {
        it('Should return 404 on a GET request.', done => {
          request(server)
            .get('/calendar/tracks?country=foo')
            .expect(404, done);
        });
      });
    });
  });
});
