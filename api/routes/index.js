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
const iCalCtrl = require('../controllers/ical');
const auth = require('../middleware/auth');

// routes ==================================================

// Authentication
router.post('/auth/login', AuthCtrl.login);
router.post('/auth/logout', AuthCtrl.logout);
router.post('/auth/changepassword', AuthCtrl.changepassword);
router.get('/auth/me', AuthCtrl.me);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Resources
router.get('/resources', auth.tvcrew_auth, ResourcesCtrl.getResources);

// Event
router.post('/calendar/event/create', auth.tvcrew_auth, EventCtrl.createEvent);
router.post('/calendar/event/update/:id', auth.tvcrew_auth, EventCtrl.updateEvent);
router.post('/calendar/event/delete/:id', auth.tvcrew_auth, EventCtrl.deleteEvent);

// EventSession
router.post('/calendar/eventsession/create', auth.tvcrew_auth, EventSessionCtrl.createEventSession);
router.post('/calendar/eventsession/update/:id', auth.tvcrew_auth, EventSessionCtrl.updateEventSession);
router.post('/calendar/eventsession/delete/:id', auth.tvcrew_auth, EventSessionCtrl.deleteEventSession);

// Series
router.post('/calendar/series/create', auth.tvcrew_auth, SeriesCtrl.createSeries);
router.post('/calendar/series/update/:id', auth.tvcrew_auth, SeriesCtrl.updateSeries);
router.post('/calendar/series/delete/:id', auth.tvcrew_auth, SeriesCtrl.deleteSeries);

// Track
router.post('/calendar/track/create', auth.tvcrew_auth, TrackCtrl.createTrack);
router.post('/calendar/track/update/:id', auth.tvcrew_auth, TrackCtrl.updateTrack);
router.post('/calendar/track/delete/:id', auth.tvcrew_auth, TrackCtrl.deleteTrack);

// iCal
router.get('/calendar/ical/event/:id', iCalCtrl.createIcal);

// Catch-all, will return 404
router.get('*', (req, res) => {
	res.status(404).send();
});

module.exports = router;
