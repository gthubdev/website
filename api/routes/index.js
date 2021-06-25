const express = require('express');
const router = express.Router();

// controllers
const AuthCtrl = require('../controllers/auth');
const CalendarCtrl = require('../controllers/calendar');
const EventCtrl = require('../controllers/event');
const EventSessionCtrl = require('../controllers/eventsession');
const ResourcesCtrl = require('../controllers/resources');
const SeriesCtrl = require('../controllers/series');
const TrackCtrl = require('../controllers/track');
const BlogCtrl = require('../controllers/blog');
const iCalCtrl = require('../controllers/ical');
const auth = require('../middleware/auth');

// routes ==================================================

// Authentication
router.post('/auth/login', AuthCtrl.login);
router.post('/auth/logout', AuthCtrl.logout);
router.post('/auth/changepassword', AuthCtrl.changepassword);
router.get('/auth/me', AuthCtrl.me);

// User

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Resources
router.get('/resources', auth.staff_auth, ResourcesCtrl.getResources);

// Blog
router.get('/blog', BlogCtrl.getBlog);

// Event
router.post('/calendar/event/create', auth.staff_auth, EventCtrl.createEvent);
router.post('/calendar/event/update/:id', auth.staff_auth, EventCtrl.updateEvent);
router.post('/calendar/event/delete/:id', auth.staff_auth, EventCtrl.deleteEvent);

// EventSession
router.post('/calendar/eventsession/create', auth.staff_auth, EventSessionCtrl.createEventSession);
router.post('/calendar/eventsession/update/:id', auth.staff_auth, EventSessionCtrl.updateEventSession);
router.post('/calendar/eventsession/delete/:id', auth.staff_auth, EventSessionCtrl.deleteEventSession);

// Series
router.post('/calendar/series/create', auth.staff_auth, SeriesCtrl.createSeries);
router.post('/calendar/series/update/:id', auth.staff_auth, SeriesCtrl.updateSeries);
router.post('/calendar/series/delete/:id', auth.staff_auth, SeriesCtrl.deleteSeries);

// Track
router.post('/calendar/track/create', auth.staff_auth, TrackCtrl.createTrack);
router.post('/calendar/track/update/:id', auth.staff_auth, TrackCtrl.updateTrack);
router.post('/calendar/track/delete/:id', auth.staff_auth, TrackCtrl.deleteTrack);

// Blogposts
router.post('/blog/create', auth.staff_auth, BlogCtrl.createBlogPost);
router.post('/blog/update/:id', auth.staff_auth, BlogCtrl.updateBlogPost);
router.post('/blog/delete/:id', auth.staff_auth, BlogCtrl.deleteBlogPost);

// iCal
router.get('/calendar/ical/event/:id', iCalCtrl.createIcal);

// Catch-all, will return 404
router.get('*', (req, res) => {
	res.status(404).send();
});

module.exports = router;
