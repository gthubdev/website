const express 	        = require('express');
const app 		        = express();
const bodyParser        = require('body-parser');
const methodOverride    = require('method-override');
const session           = require('express-session');
const SessionFileStore  = require('session-file-store')(session);
const util 				= require('./util/util.js');

// set the default port to 3000
const port = process.env.PORT || 3000;

// set the template engine
app.set('view engine', 'ejs');

// clear old sessions
util.clearSessions();

// handle authentication
app.use(session({
	secret: 'supersecretsecret',
	name: 'gthubcookie',
	store: new SessionFileStore({logFn: function(){}}),
	//proxy: true,
	resave: false,
	saveUninitialized: false
}));

// get all data/stuff of the body (POST) parameters
// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public'));

// routes
const index = require('./routes/index');
app.use('/', index);

const server = app.listen(port, () => {
	console.log('Server running on port ' + port);
});

module.exports = server;
