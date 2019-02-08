const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.render('landing.ejs');
});

router.get('/gallery', (req, res, next) => {
	res.render('gallery.ejs');
});

router.get('/calendar', (req, res, next) => {
	res.render('landing.ejs');
});

router.get('/podcast', (req, res, next) => {
	res.render('podcast.ejs');
});

// route to handle all other requests
router.get('*', function(req, res) {
	res.redirect('/');
});


module.exports = router;
