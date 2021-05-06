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
	}
};
