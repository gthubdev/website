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
	},
	add(state, newtrack) {
		state.tracks.push(newtrack);
		state.tracks.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	}
};
