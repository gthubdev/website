export const state = () => ({
	posts: []
});

export const getters = {
	get(state) {
		return state.posts;
	}
};

export const mutations = {
	set(state, newValue) {
		state.posts = newValue;
	},
	add(state, newPost) {
		state.posts.push(newPost);
		state.posts.sort((a, b) => {
			return b.createdAt.localeCompare(a.createdAt);
		});
	}
};
