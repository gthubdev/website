export const state = () => ({
	events: []
});

export const getters = {
	get(state) {
		return state.events;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.events = newvalue;
	},
	add(state, newValue) {
		state.events.push(newValue);
		state.events.sort((a, b) => {
			return a.startdate.localeCompare(b.startdate);
		});
	},
	update(state, updatedEvent) {
		const index = state.events.findIndex(e => e.id === updatedEvent.id);
		state.events.splice(index, 1, updatedEvent);
		state.events.sort((a, b) => {
			return a.startdate.localeCompare(b.startdate);
		});
	},
	delete(state, eventid) {
		const index = state.events.findIndex(e => e.id === eventid);
		state.events.splice(index, 1);
	},
	deleteSession(state, data) {
		const index_e = state.events.findIndex(e => e.id === data.eventid);
		const index_s = state.events[index_e].EventSessions.findIndex(s => s.id === data.sessionid);
		state.events[index_e].EventSessions.splice(index_s, 1);
	}
};
