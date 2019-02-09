const express = require('express');
const router = express.Router();

// controllers
const StartpageCtrl = require('../controllers/startpage');
const GalleryCtrl = require('../controllers/gallery');
const CalendarCtrl = require('../controllers/calendar');
const PodcastCtrl = require('../controllers/podcast');


// routes
router.get('/', StartpageCtrl.getStartpage);

router.get('/gallery', GalleryCtrl.getGallery);

router.get('/calendar', CalendarCtrl.getCalendar);

router.get('/calendar/event', CalendarCtrl.getEvents);

router.get('/calendar/series', CalendarCtrl.getSeries);

router.get('/calendar/tracks', CalendarCtrl.getTracks);

router.get('/podcast', PodcastCtrl.getPodcast);


// route to handle all other requests
router.get('*', function(req, res) {
	res.redirect('/');
});


module.exports = router;
