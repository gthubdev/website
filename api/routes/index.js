const express = require('express');
const router = express.Router();

// controllers
const AuthCtrl = require('../controllers/auth');
const UserCtrl = require('../controllers/user');
const CalendarCtrl = require('../controllers/calendar');
const EventCtrl = require('../controllers/event');
const EventSessionCtrl = require('../controllers/eventsession');
const ResourcesCtrl = require('../controllers/resources');
const SeriesCtrl = require('../controllers/series');
const TrackCtrl = require('../controllers/track');
const BlogCtrl = require('../controllers/blog');
const iCalCtrl = require('../controllers/ical');
const auth = require('../middleware/auth');
const VehClassCtrl = require('../controllers/classes');

// routes ==================================================

// Authentication
router.post('/auth/login', AuthCtrl.login);
router.post('/auth/logout', AuthCtrl.logout);
router.post('/auth/changepassword', AuthCtrl.changepassword);
router.get('/auth/me', AuthCtrl.me);

// User
router.post('/user', auth.admin_auth, UserCtrl.createUser);
router.put('/user/:id', UserCtrl.updateUser);
router.delete('/user/:id', auth.admin_auth, UserCtrl.deleteUser);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Resources
router.get('/resources', auth.staff_auth, ResourcesCtrl.getResources);

// Blog
router.get('/blog', BlogCtrl.getBlog);

// Event
router.post('/event/create', auth.staff_auth, EventCtrl.createEvent);
router.put('/event/:id', auth.staff_auth, EventCtrl.updateEvent);
router.delete('/event/:id', auth.staff_auth, EventCtrl.deleteEvent);

// EventSession
router.post('/calendar/eventsession', auth.staff_auth, EventSessionCtrl.createEventSession);
router.put('/eventsession/:id', auth.staff_auth, EventSessionCtrl.updateEventSession);
router.delete('/eventsession/:id', auth.staff_auth, EventSessionCtrl.deleteEventSession);

// Series
router.get('/series', auth.staff_auth, SeriesCtrl.find);
router.get('/series/:id', SeriesCtrl.findOne);
router.post('/series', auth.staff_auth, SeriesCtrl.createSeries);
router.put('/series/:id', auth.staff_auth, SeriesCtrl.updateSeries);
router.delete('/series/:id', auth.staff_auth, SeriesCtrl.deleteSeries);

// Track
router.post('/calendar/track', auth.staff_auth, TrackCtrl.createTrack);
router.put('/track/:id', auth.staff_auth, TrackCtrl.updateTrack);
router.delete('/track/:id', auth.staff_auth, TrackCtrl.deleteTrack);

// Blogposts
router.post('/blog', auth.staff_auth, BlogCtrl.createBlogPost);
router.put('/blog/:id', auth.staff_auth, BlogCtrl.updateBlogPost);
router.delete('/blog/:id', auth.staff_auth, BlogCtrl.deleteBlogPost);

// Vehicle classes
router.get('/vehicleclasses', auth.staff_auth, VehClassCtrl.find);

// iCal
router.get('/calendar/ical/event/:id', iCalCtrl.createIcal);

// Catch-all, will return 404
router.get('*', (req, res) => {
	res.status(404).send();
});

module.exports = router;
