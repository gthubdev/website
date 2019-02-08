const express = require('express');
const app = express();

// set the default port to 3000
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes
const index = require('./routes/index');
app.use('/', index);

const server = app.listen(3000, () => {
  console.log('Server running on port ' + port);
});

module.exports = server;
