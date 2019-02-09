// Require other models
const db = require('./database');
const series = require('./series');
const tracks = require('./tracks');

// Handles all the requests for events
exports.get = (column, value) => {
  if (column !== undefined && value !== undefined) {
    switch (column) {
      case 'name':
        return GetByName(value);
      case 'date':
        return GetByDate(value);
      case 'month':
        return GetThisMonth(value);
      case 'serie':
        return GetBySerie(value);
      case 'track':
        return GetByTrack(value);
      default:
        return GetAll();
    }
  } else {
      return GetAll();
  }
}

// Gets events looking at the name column
function GetByName(value) {
  return new Promise((resolve, reject) => {
    let session = db.connect();
    session
      .select()
      .where('name', value)
      .from('event')
      .then(events => RemoveInts(events).then(val => resolve(val)))
      .catch(e => reject(e))
      .finally(() => session.destroy());
  });
}

// Gets events that either start or finish on a date
function GetByDate(value) {
  return new Promise((resolve, reject) => {
    let session = db.connect();
    session
      .select()
      .where('date_start', new Date(value))
      .orWhere('date_end', new Date(value))
      .from('event')
      .then(events => RemoveInts(events).then(val => resolve(val)))
      .catch(e => reject(e))
      .finally(() => session.destroy());
  });
}

// Gets the events of the current month
function GetThisMonth() {
  return new Promise((resolve, reject) => {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let nextMonth = new Date(date.getFullYear(), date.getMonth() + 2);

    let session = db.connect();
    session
      .select()
      .from('event')
      .where('date_start', '>', firstDay)
      .andWhere('date_start', '<', nextMonth)
      .then(events => RemoveInts(events).then(val => resolve(val)))
      .catch(e => reject(e))
      .finally(() => session.destroy());
  });
}

// Gets all the events for a specific series
function GetBySerie(value) {
  return new Promise((resolve, reject) => {
    series.get().then(series => {
      let serie = series.filter(x => x.id === value.serie)[0].name;
      let session = db.connect();
      session
        .select()
        .from('event')
        .where('serie', serie)
        .then(events => RemoveInts(events).then(events => resolve(events)));
    });
  });
}

// Gets all the events for a specific track
function GetByTrack(value) {
  return new Promise((resolve, reject) => {
    tracks.get().then(tracks => {
      let track = tracks.filter(x => x.id === value.track)[0].name;
      let session = db.connect();
      session
        .select()
        .from('event')
        .where('track', track)
        .then(events => RemoveInts(events).then(events => resolve(events)));
    });
  });
}

// ? GetBySerie and GetByTrack could be merged

// Gets all the events, just as a fallback
function GetAll() {
  return new Promise((resolve, reject) => {
    let session = db.connect();
    session
      .select()
      .from('event')
      .then(val => resolve(val))
      .catch(e => reject(e))
      .finally(() => session.destroy());
  });
}

// Replaces IDs for table relationships in Postgres
function ReplaceIDs(main, second, value) {
  return main.forEach(entry => {
    return (entry[value] = second.filter(x => x.id === entry[value])[0]);
  });
}

// Removes both IDs for series and tracks to return data
// (this is used a lot, so a standalone function works better)
function RemoveInts(main) {
  return new Promise((resolve, reject) => {
    series.get().then(series => {
      ReplaceIDs(main, series, 'serie');
      tracks.get().then(tracks => {
        ReplaceIDs(main, tracks, 'track');
        resolve(main);
      });
    });
  });
}
