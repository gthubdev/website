export const state = () => ({
	tracks: []
});

export const getters = {
	get(state) {
		return state.tracks;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.tracks = newvalue;
	}
};
