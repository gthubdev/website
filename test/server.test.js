const assert = require('assert');
const http = require('http');
describe('Routes', () => {
  let routes200 = ['/', '/calendar', '/podcast', '/gallery', '/assets/test_file', '/js/test_file', '/css/test_file'];

  routes200.forEach(route => {

    describe(route, function() {
      it('Should return 200 on a GET request.', () => {
        http.get('http://localhost:3000'+route, res => {
          assert.equal(res.statusCode, 200);
        })
      });
    });
  });

  let routes404 = ['/test', '/foo', '/package.json'];

    routes404.forEach(route => {
      describe(route, function() {
        it("Should return 404 on a GET request.", () => {
          http.get("http://localhost:3000" + route, res => {
            assert.equal(res.statusCode, 404);
          });
        });
      });
    });

});
