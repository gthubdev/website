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
			if (a.priority === b.priority)
				return a.name.localeCompare(b.name);
			else
				return a.priority - b.priority;
		});
	},
	update(state, updatedSeries) {
		const index = state.series.findIndex(s => s.id === updatedSeries.id);
		console.log('Updated series:', updatedSeries);
		console.log('Index:', index);
		state.series.splice(index, 1, updatedSeries);
		state.series.sort((a, b) => {
			if (a.priority === b.priority)
				return a.name.localeCompare(b.name);
			else
				return a.priority - b.priority;
		});
	},
	delete(state, seriesid) {
		const index = state.series.findIndex(s => s.id === seriesid);
		state.series.splice(index, 1);
	}
};
