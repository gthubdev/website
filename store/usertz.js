const defaultTimezone = 'Europe/Amsterdam';

export const state = () => ({
	usertz: defaultTimezone,
	timezones: []
});

export const getters = {
	get(state) {
		return state.usertz;
	},
	getDefaultTimezone(state) {
		const index = state.timezones.findIndex(tz => tz.name === defaultTimezone);
		if (index >= 0)
			return state.timezones[index];
		else
			return null;
	},
	getTimezones(state) {
		return state.timezones;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.usertz = newvalue;
	},
	setDefault(state) {
		state.usertz = defaultTimezone;
	},
	setTimezones(state, newvalue) {
		state.timezones = newvalue;
	}
};
