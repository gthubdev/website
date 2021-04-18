export const state = () => ({
	series: []
});

export const getters = {
	get(state) {
		return state.series;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.series = newvalue;
	}
};
