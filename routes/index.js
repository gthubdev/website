const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
	res.render('landing.ejs');
});

router.get('/gallery', (req, res) => {
	res.render('gallery.ejs');
});

router.get('/calendar', (req, res) => {
	res.render('landing.ejs');
});

router.get('/podcast', (req, res) => {
	res.render('podcast.ejs');
});

// route to handle all other requests
router.get('*', function(req, res) {
	res.redirect('/');
});


module.exports = router;
