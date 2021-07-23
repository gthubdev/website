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
				{{ post.title }}
			</template>
			<template #content>
				<div>
					Author: {{ post.author.name }} ({{ formatDate(post.createdAt) }})
				</div>
				<div v-html="post.content" />
			</template>
		</Card>
	</div>

	<Paginator
		:first.sync="firstIndex"
		:rows="nrOfPostsPerPage"
		:total-records="nrOfPosts"
		@page="pageChanged($event)"
	/>
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
			displayedPosts: [],
			nrOfPosts: 0,
			nrOfPostsPerPage: 3,
			firstIndex: 0
		};
	},
	created() {
		this.nrOfPosts = this.data.blogposts.length;
		this.displayedPosts = this.data.blogposts.slice(this.firstIndex, this.firstIndex + this.nrOfPostsPerPage);
	},
	methods: {
		formatDate(date) {
			return this.$dayjs(date).format('YYYY-MM-DD HH:mm');
		},
		pageChanged(event) {
			this.firstIndex = event.first;
			this.displayedPosts = this.data.blogposts.slice(this.firstIndex, this.firstIndex + this.nrOfPostsPerPage);
		}
	}
};
</script>

<style scoped>
.p-card {
	@apply m-4;
}
</style>
