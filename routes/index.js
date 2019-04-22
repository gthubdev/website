const express = require('express');
const router = express.Router();
const util = require('../util/util.js');

// controllers
const AuthCtrl = require('../controllers/auth.js');
const StartpageCtrl = require('../controllers/startpage');
const GalleryCtrl = require('../controllers/gallery');
const CalendarCtrl = require('../controllers/calendar');
const PodcastCtrl = require('../controllers/podcast');


// routes ==================================================

// Startpage
router.get('/', StartpageCtrl.getStartpage);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Gallery
router.get('/gallery', GalleryCtrl.getGallery);

// Podcast
router.get('/podcast', PodcastCtrl.getPodcast);

// Authentication
router.post('/login', AuthCtrl.login);
router.post('/logout', AuthCtrl.logout);

// Error-handling
// TODO
router.get('/error', (req, res) => {
	res.render('landing.ejs', {
		loggedIn: util.isLoggedIn(req)
	});
});


// route to handle all other requests
router.get('*', function(req, res) {
	res.redirect('/');
});


module.exports = router;
