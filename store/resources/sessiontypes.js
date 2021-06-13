export const state = () => ({
	types: []
});

export const getters = {
	get(state) {
		return state.types;
	}
};

export const mutations = {
	set(state, newValue) {
		state.types = newValue;
	}
};
