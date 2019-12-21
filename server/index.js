const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const env = require('dotenv');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');
env.config();
config.dev = process.env.NODE_ENV !== 'production';

// set the default port to 3000
const port = process.env.PORT || 3000;
const host = process.env.IP || '127.0.0.1';

async function start() {
	// Init Nuxt.js
	const nuxt = new Nuxt(config);

	// Build only in dev mode
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	} else {
		await nuxt.ready();
	}

	// Give nuxt middleware to express
	app.use(nuxt.render);

	// Listen the server
	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true
	});
}
start()
	.then()
	.catch(console.error);
