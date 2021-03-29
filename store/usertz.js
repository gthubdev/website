export const state = () => ({
	tz: ''
});

export const getters = {
	get(state) {
		return state.tz;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.tz = newvalue;
	}
};
