const express = require('express');
const router = express.Router();

// controllers
const AuthCtrl = require('../controllers/auth');
const CalendarCtrl = require('../controllers/calendar');
const EventCtrl = require('../controllers/event');
const EventSessionCtrl = require('../controllers/eventsession');
const SeriesCtrl = require('../controllers/series');
const TrackCtrl = require('../controllers/track');
const iCalCtrl = require('../controllers/ical');


// routes ==================================================

// Authentication
router.post('/login', AuthCtrl.login);
router.post('/logout', AuthCtrl.logout);
router.post('/changepassword', AuthCtrl.changepassword);

// Calendar
router.get('/calendar', CalendarCtrl.getCalendar);

// Event
router.post('/calendar/event/create', EventCtrl.createEvent);
router.post('/calendar/event/update/:id', EventCtrl.updateEvent);
router.post('/calendar/event/delete/:id', EventCtrl.deleteEvent);

// EventSession
router.post('/calendar/eventsession/create', EventSessionCtrl.createEventSession);
router.post('/calendar/eventsession/update/:id', EventSessionCtrl.updateEventSession);
router.post('/calendar/eventsession/delete/:id', EventSessionCtrl.deleteEventSession);

// Series
router.post('/calendar/series/create', SeriesCtrl.createSeries);
router.post('/calendar/series/update/:id', SeriesCtrl.updateSeries);
router.post('/calendar/series/delete/:id', SeriesCtrl.deleteSeries);

// Track
router.post('/calendar/track/create', TrackCtrl.createTrack);
router.post('/calendar/track/update/:id', TrackCtrl.updateTrack);
router.post('/calendar/track/delete/:id', TrackCtrl.deleteTrack);

// iCal
router.get('/calendar/ical/event/:id', iCalCtrl.createIcal);


// Catch-all, will return 404
router.get('*', (req, res) => {
	res.status(404).send();
});

module.exports = router;
