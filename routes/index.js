const express = require('express');
const router = express.Router();
const util = require('../util/util.js');

// controllers
const StartpageCtrl = require('../controllers/startpage');
const CalendarCtrl = require('../controllers/calendar');
const AuthCtrl = require('../controllers/auth.js');
const EventCtrl = require('../controllers/event.js');
const EventSessionCtrl = require('../controllers/eventsession.js');
const SeriesCtrl = require('../controllers/series.js');
const TrackCtrl = require('../controllers/track');
const GalleryCtrl = require('../controllers/gallery');
const PodcastCtrl = require('../controllers/podcast');


// routes ==================================================

// Startpage
router.get('/', StartpageCtrl.getStartpage);

// Authentication
router.post('/login', AuthCtrl.login);
router.post('/logout', AuthCtrl.logout);
router.post('/changepassword', AuthCtrl.changepassword);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);
router.post('/calendar/timezone', CalendarCtrl.getCalendarWithTimezone);

// Event
router.post('/calendar/event/create', EventCtrl.createEvent);

// EventSession
router.post('/calendar/eventsession/create', EventSessionCtrl.createEventSession);

// Series
router.post('/calendar/series/create', SeriesCtrl.createSeries);

// Track
router.post('/calendar/track/create', TrackCtrl.createTrack);

// Gallery
router.get('/gallery', GalleryCtrl.getGallery);

// Podcast
router.get('/podcast', PodcastCtrl.getPodcast);


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
