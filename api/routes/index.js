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
const VehCatCtrl = require('../controllers/categories');

// routes ==================================================

// Authentication
router.post('/auth/login', AuthCtrl.login);
router.post('/auth/logout', AuthCtrl.logout);
router.post('/auth/changepassword', AuthCtrl.changepassword);
router.get('/auth/me', AuthCtrl.me);

// User
router.post('/users', auth.admin_auth, UserCtrl.createUser);
router.put('/users/:id', UserCtrl.updateUser);
router.delete('/users/:id', auth.admin_auth, UserCtrl.deleteUser);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Resources
router.get('/resources', auth.staff_auth, ResourcesCtrl.getResources);

// Blog
router.get('/blog', BlogCtrl.getBlog);

// Event
router.get('/events', auth.staff_auth, EventCtrl.find);
router.post('/events', auth.staff_auth, EventCtrl.createEvent);
router.put('/events/:id', auth.staff_auth, EventCtrl.updateEvent);
router.delete('/events/:id', auth.staff_auth, EventCtrl.deleteEvent);

// EventSession
router.post('/eventsessions', auth.staff_auth, EventSessionCtrl.createEventSession);
router.put('/eventsessions/:id', auth.staff_auth, EventSessionCtrl.updateEventSession);
router.delete('/eventsessions/:id', auth.staff_auth, EventSessionCtrl.deleteEventSession);

// Series
router.get('/series', auth.staff_auth, SeriesCtrl.find);
router.get('/series/:id', SeriesCtrl.findOne);
router.post('/series', auth.staff_auth, SeriesCtrl.createSeries);
router.put('/series/:id', auth.staff_auth, SeriesCtrl.updateSeries);
router.delete('/series/:id', auth.staff_auth, SeriesCtrl.deleteSeries);

// Track
router.get('/tracks', auth.staff_auth, TrackCtrl.find);
router.post('/tracks', auth.staff_auth, TrackCtrl.createTrack);
router.put('/tracks/:id', auth.staff_auth, TrackCtrl.updateTrack);
router.delete('/tracks/:id', auth.staff_auth, TrackCtrl.deleteTrack);

// Blogposts
router.post('/blogs', auth.staff_auth, BlogCtrl.createBlogPost);
router.put('/blogs/:id', auth.staff_auth, BlogCtrl.updateBlogPost);
router.delete('/blogs/:id', auth.staff_auth, BlogCtrl.deleteBlogPost);

// Vehicle classes
router.get('/vehicleclasses', auth.staff_auth, VehClassCtrl.find);

// Vehicle Categories
router.get('/vehiclecategories', auth.staff_auth, VehCatCtrl.find);

// iCal
router.get('/calendar/ical/event/:id', iCalCtrl.createIcal);

// Catch-all, will return 404
router.get('*', (req, res) => {
	res.status(404).send();
});

module.exports = router;
