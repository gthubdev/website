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
	},
	update(state, updatedTrack) {
		const index = state.tracks.findIndex(t => t.id === updatedTrack.id);
		state.tracks.splice(index, 1, updatedTrack);
		state.tracks.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	},
	delete(state, trackid) {
		const index = state.tracks.findIndex(t => t.id === trackid);
		state.tracks.splice(index, 1);
	}
};
