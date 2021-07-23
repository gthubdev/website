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
const BlogPostCtrl = require('../controllers/blogpost');
const BlogCatCtrl = require('../controllers/blogcategory');
const BlogTagCtrl = require('../controllers/blogtag');
const iCalCtrl = require('../controllers/ical');
const auth = require('../middleware/auth');
const VehClassCtrl = require('../controllers/vehicleclass');
const VehCatCtrl = require('../controllers/vehicleclasscategory');

// routes ==================================================

// Authentication
router.post('/auth/login', AuthCtrl.login);
router.post('/auth/logout', AuthCtrl.logout);
router.post('/auth/changepassword', AuthCtrl.changepassword);
router.get('/auth/me', AuthCtrl.me);

// User
router.post('/users', auth.admin_auth, UserCtrl.create);
router.put('/users/:id', UserCtrl.update);
router.delete('/users/:id', auth.admin_auth, UserCtrl.delete);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Resources
router.get('/resources', auth.staff_auth, ResourcesCtrl.getResources);
router.get('/resources/timezones', auth.staff_auth, ResourcesCtrl.timezones);

// Blog
router.get('/blog', BlogPostCtrl.findAll);

// Event
router.get('/event', auth.staff_auth, EventCtrl.findAll);
router.post('/event', auth.staff_auth, EventCtrl.create);
router.put('/event/:id', auth.staff_auth, EventCtrl.update);
router.delete('/event/:id', auth.staff_auth, EventCtrl.delete);

// EventSession
router.post('/eventsession', auth.staff_auth, EventSessionCtrl.create);
router.put('/eventsession/:id', auth.staff_auth, EventSessionCtrl.update);
router.delete('/eventsession/:id', auth.staff_auth, EventSessionCtrl.delete);

// Series
router.get('/series', auth.staff_auth, SeriesCtrl.findAll);
router.get('/series/:id', auth.staff_auth, SeriesCtrl.findOne);
router.post('/series', auth.staff_auth, SeriesCtrl.create);
router.put('/series/:id', auth.staff_auth, SeriesCtrl.update);
router.delete('/series/:id', auth.staff_auth, SeriesCtrl.delete);

// Track
router.get('/track', auth.staff_auth, TrackCtrl.findAll);
router.get('/track/:id', auth.staff_auth, TrackCtrl.findOne);
router.post('/track', auth.staff_auth, TrackCtrl.create);
router.put('/track/:id', auth.staff_auth, TrackCtrl.update);
router.delete('/track/:id', auth.staff_auth, TrackCtrl.delete);

// Blogposts
router.post('/blogs', auth.staff_auth, BlogPostCtrl.create);
router.put('/blogs/:id', auth.staff_auth, BlogPostCtrl.update);
router.delete('/blogs/:id', auth.staff_auth, BlogPostCtrl.delete);

// Blog Categories
router.get('/blogcategory', auth.staff_auth, BlogCatCtrl.findAll);
router.get('/blogcategory/:id', auth.staff_auth, BlogCatCtrl.fineOne);
router.post('/blogcategory', auth.staff_auth, BlogCatCtrl.create);
router.put('/blogcategory/:id', auth.staff_auth, BlogCatCtrl.update);
router.delete('/blogcategory/:id', auth.staff_auth, BlogCatCtrl.delete);

// Blog Tags
router.get('/blogtag', auth.staff_auth, BlogTagCtrl.findAll);
router.get('/blogtag/:id', auth.staff_auth, BlogTagCtrl.fineOne);
router.post('/blogtag', auth.staff_auth, BlogTagCtrl.create);
router.put('/blogtag/:id', auth.staff_auth, BlogTagCtrl.update);
router.delete('/blogtag/:id', auth.staff_auth, BlogTagCtrl.delete);

// Vehicle classes
router.get('/vehicleclass', auth.staff_auth, VehClassCtrl.findAll);
router.get('/vehicleclass/:id', auth.staff_auth, VehClassCtrl.findOne);
router.post('/vehicleclass', auth.staff_auth, VehClassCtrl.create);
router.put('/vehicleclass/:id', auth.staff_auth, VehClassCtrl.update);
router.delete('/vehicleclass/:id', auth.staff_auth, VehClassCtrl.delete);

// Vehicle Categories
router.get('/vehiclecategory', auth.staff_auth, VehCatCtrl.findAll);
router.get('/vehiclecategory/:id', auth.staff_auth, VehCatCtrl.findOne);
router.post('/vehiclecategory', auth.staff_auth, VehCatCtrl.create);
router.put('/vehiclecategory/:id', auth.staff_auth, VehCatCtrl.update);
router.delete('/vehiclecategory/:id', auth.staff_auth, VehCatCtrl.delete);

// iCal
router.get('/calendar/ical/event/:id', iCalCtrl.createIcal);

// Catch-all, will return 404
router.get('*', (req, res) => {
	res.status(404).send();
});

module.exports = router;
