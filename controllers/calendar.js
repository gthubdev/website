// Database methods
let series = require('../models/series');
let tracks = require('../models/tracks');
let events = require('../models/events');

module.exports.getCalendar = (req, res) => {
  res.render('calendar.ejs');
};

module.exports.getEvents = (req, res) => {
  let params = req.url.split('?')[1].split('=');
  events.get(params[0], params[1]).then(val => {
    if (val.length > 0) {
		res.set('Content-Type', 'application/json');
      	res.send(JSON.stringify({ data: val }));
    } else {
      res.sendStatus(404);
    }
  });
};

module.exports.getSeries = (req, res) => {
  let params = req.url.split('?')[1].split('=');
  series.get(params[0], params[1]).then(val => {
    if (val.length > 0) {
		res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: val }));
    } else {
      res.sendStatus(404);
    }
  });
};

module.exports.getTracks = (req, res) => {
  let params = req.url.split('?')[1].split('=');
  tracks.get(params[0], params[1]).then(val => {
    if (val.length > 0) {
		res.set('Content-Type', 'application/json');
      res.send(JSON.stringify({ data: val }));
    } else {
      res.sendStatus(404);
    }
  });
};
