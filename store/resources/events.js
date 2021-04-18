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
	}
};
