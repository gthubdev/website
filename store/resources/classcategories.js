export const state = () => ({
	categories: []
});

export const getters = {
	get(state) {
		return state.categories;
	}
};

export const mutations = {
	set(state, newvalue) {
		state.categories = newvalue;
	}
};
