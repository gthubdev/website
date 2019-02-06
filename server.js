const express = require('express');
const server = express();

server.set('view engine', 'ejs')

server.use('/assets', express.static('assets'));
server.use('/js', express.static('js'));
server.use('/css', express.static('css'));

server.get('/', function (req, res) {
  res.render('landing.ejs');
});

server.get('/gallery', function (req, res) {
  res.render('gallery.ejs');
});

server.get('/calendar', function (req, res) {
  res.render('landing.ejs');
});

server.get('/podcast', function (req, res) {
  res.render('podcast.ejs');
});

server.listen(3000, () => {
  console.log('Server running on port 3000.')
});