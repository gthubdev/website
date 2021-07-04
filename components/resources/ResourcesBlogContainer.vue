<template>
<div class="resources">
	<div class="resources-top-bar">
		<div>
			<!--<span class="p-input-icon-left">-->
			<!--	<i class="pi pi-search" />-->
			<!--	<InputText id="trackSearchTerm" v-model="searchTerm" type="text" />-->
			<!--</span>-->
		</div>
		<div>
			<Button label="CREATE BLOGPOST" class="p-button-raised" @click="openBlogCrud()" />
		</div>
	</div>
	<div>
		<DataView
			:value="displayedPosts"
			paginator-position="bottom"
			:paginator="true"
			:rows="5"
			:always-show-paginator="false"
		>
			<template #list="slotProps">
				<div class="resource-list-item-container">
					<div class="resource-list-item">
						{{ slotProps.data.title }} (by {{ slotProps.data.User.name }})
					</div>
					<div>
						<Button icon="pi pi-pencil" @click="editPost(slotProps.data)" />
						<Button icon="pi pi-trash" @click="sendDeleteRequest(slotProps.data)" />
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<ResourcesBlogCRUD
		:show-dialog="showDialog"
		:is-editing="isEditing"
		:editing-post="editingPost"
		@blog-crud-closed="closeBlogCrud"
		@send-request="sendRequest"
	/>
</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			displayedPosts: [],
			showDialog: false,
			isEditing: false,
			editingPost: null
		};
	},
	computed: {
		...mapGetters({
			posts: 'resources/blogposts/get'
		})
	},
	created() {
		this.displayedPosts = this.posts;
	},
	methods: {
		...mapMutations({
			addPost: 'resources/blogposts/add',
			deletePost: 'resources/blogposts/delete',
			updatePost: 'resources/blogposts/update'
		}),
		openBlogCrud() {
			this.showDialog = true;
		},
		closeBlogCrud() {
			this.showDialog = false;
			this.isEditing = false;
			this.editingPost = null;
		},
		editPost(post) {
			this.isEditing = true;
			this.editingPost = JSON.parse(JSON.stringify(post));
			this.showDialog = true;
		},
		async sendDeleteRequest(post) {
			try {
				const res = await this.$axios.$delete('/api/blog/' + post.id);
				if (res.deleted >= 1) {
					this.deletePost(post.id);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Blogpost deleted.', life: 5000 });
				}
			} catch (err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
				else if (err.response)
					alert(err.response);
			}
		},
		async sendRequest(obj) {
			const blogpost = JSON.parse(JSON.stringify(obj));

			try {
				let res;
				if (this.isEditing === false)
					res = await this.$axios.$post('/api/blog', {
						blogpost: blogpost
					});
				else
					res = await this.$axios.$put('/api/blog/' + blogpost.id, {
						blogpost: blogpost
					});

				if (this.isEditing === false) {
					this.addPost(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Blogpost created.', life: 5000 });
				} else {
					this.updatePost(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Blogpost updated.', life: 5000 });
				}
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}

			this.showDialog = false;
			this.isEditing = false;
			this.editingPost = null;
		}
	}
};
</script>

<style scoped>

</style>
