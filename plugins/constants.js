const itemsPerPage = 5;

export const constants = {
	ITEMS_PER_PAGE: itemsPerPage,
	ITEMS_PER_PAGE_EVENTS: itemsPerPage,
	ITEMS_PER_PAGE_SERIES: itemsPerPage,
	ITEMS_PER_PAGE_TRACKS: itemsPerPage,

	PRIORITY_MAX: 4
};

export const strings = {
	CONFIRM_DELETE_EVENT: 'confirmDeleteEvent',
	CONFIRM_DELETE_EVENTSESSION: 'confirmDeleteEventSession',
	CONFIRM_DELETE_SERIES: 'confirmDeleteSeries',
	CONFIRM_DELETE_TRACK: 'confirmDeleteTrack',
	CLOSED_CRUD_EVENT: 'closedCrudEvent',
	CLOSED_CRUD_EVENTSESSION: 'closed-crud-eventsession',
	CLOSED_CRUD_SERIES: 'closedCrudSeries',
	CLOSED_CRUD_TRACK: 'closedCrudTrack',
	EVENT_CREATED: 'eventCreated',
	EVENT_UPDATED: 'eventUpdated',
	EVENTSESSION_CREATED: 'event-session-created',
	EVENTSESSION_UPDATED: 'event-session-updated',
	SEND_REQUEST_CRUD_EVENT: 'send-request-crud-event',
	SEND_REQUEST_CRUD_EVENTSESSION: 'send-request-crud-eventsession',
	SEND_REQUEST_CRUD_SERIES: 'send-request-crud-series',
	SEND_REQUEST_CRUD_TRACK: 'send-request-crud-track',
	SERIES_CREATED: 'seriesCreated',
	SERIES_UPDATED: 'seriesUpdated',
	TOGGLE_CRUD_EVENT: 'toggleCrudEvent',
	TOGGLE_CRUD_EVENTSESSION: 'toggleCrudEventSession',
	TOGGLE_CRUD_SERIES: 'toggleCrudSeries',
	TOGGLE_CRUD_TRACK: 'toggleCrudTrack',
	TOGGLE_CURRENT_EVENTS: 'toggleCurrentEvents',
	TOGGLE_SESSIONS: 'toggleSessions',
	TRACK_CREATED: 'trackCreated',
	TRACK_UPDATED: 'trackUpdated'
};

export const locale = {
	en: {
		firstDayOfWeek: 1,
		dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
		dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
		monthNames: [ 'January','February','March','April','May','June','July','August','September','October','November','December' ],
		monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
		today: 'Today',
		clear: 'Clear',
		dateFormat: 'dd M yy',
		weekHeader: 'Wk'
	}
};
