const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));

// routes
const index = require('./routes/index');
app.use('/', index);

const server = app.listen(3000, () => {
  console.log('Server running on port 3000.');
});

module.exports = server;
