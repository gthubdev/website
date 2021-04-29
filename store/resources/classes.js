export const state = () => ({
	classes: []
});

export const getters = {
	get(state) {
		return state.classes;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.classes = newvalue;
	}
};
