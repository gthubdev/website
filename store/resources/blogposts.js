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
	},
	update(state, updatedPost) {
		const index = state.posts.findIndex(p => p.id === updatedPost.id);
		state.posts.splice(index, 1, updatedPost);
		state.posts.sort((a, b) => {
			return b.createdAt.localeCompare(a.createdAt);
		});
	},
	delete(state, postid) {
		const index = state.posts.findIndex(p => p.id === postid);
		state.posts.splice(index, 1);
	}
};
