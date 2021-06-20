<template>
<div>
	<h1 class="page-headline">
		Blog
	</h1>
	<div>
		<Card
			v-for="post in displayedPosts"
			:key="post.id"
		>
			<template #title>
				{{ post.headline }}
			</template>
			<template #content>
				<div>
					Author: {{ post.User.name }} ({{ formatDate(post.createdAt) }})
				</div>
				<div v-html="post.content" />
			</template>
		</Card>
	</div>
</div>
</template>

<script>
export default {
	async asyncData({ $axios }) {
		try {
			const res = await $axios.$get('/api/blog');
			return {
				data: res
			};
		} catch (err) {
			return {
				data: []
			};
		}
	},
	data() {
		return {
			data: [],
			displayedPosts: []
		};
	},
	created() {
		this.displayedPosts = this.data.blogposts;
	},
	methods: {
		formatDate(date) {
			return this.$dayjs(date).format('YYYY-MM-DD HH:mm');
		}
	}
};
</script>

<style scoped>
.p-card {
	@apply m-4;
}
</style>
