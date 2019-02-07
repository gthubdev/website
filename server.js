const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

app.get('/', (req, res) => {
  res.render('landing.ejs');
});
app.get('/gallery', (req, res) => {
  res.render('gallery.ejs');
});

app.get('/calendar', (req, res) => {
  res.render('landing.ejs');
});

app.get('/podcast', (req, res) => {
  res.render('podcast.ejs');
});

const server = app.listen(3000, () => {
  console.log('Server running on port 3000.');
});

module.exports = server;