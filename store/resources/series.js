export const state = () => ({
	series: []
});

export const getters = {
	get(state) {
		return state.series;
	}
};

export const mutations = {
	set(state, newValue) {
		state.series = newValue;
	},
	add(state, newValue) {
		state.series.push(newValue);
		state.series.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	},
	update(state, updatedSeries) {
		const index = state.series.findIndex(s => s.id === updatedSeries.id);
		state.series.splice(index, 1, updatedSeries);
		state.series.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	},
	delete(state, seriesid) {
		const index = state.series.findIndex(s => s.id === seriesid);
		state.series.splice(index, 1);
	}
};
