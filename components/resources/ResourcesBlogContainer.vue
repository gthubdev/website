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
						{{ slotProps.data.headline }} (by {{ slotProps.data.User.name }})
					</div>
					<div>
						<!--<Button icon="pi pi-pencil" @click="editTrack(slotProps.data)" />-->
						<!--<Button icon="pi pi-trash" @click="sendDeleteRequest(slotProps.data)" />-->
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<ResourcesBlogCRUD
		:show-dialog="showDialog"
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
			showDialog: false
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
			addPost: 'resources/blogposts/add'
		}),
		openBlogCrud() {
			this.showDialog = true;
		},
		closeBlogCrud() {
			this.showDialog = false;
		},
		async sendRequest(obj) {
			const blogpost = JSON.parse(JSON.stringify(obj));
			const url = '/api/blog/create';

			try {
				const res = await this.$axios.$post(url, {
					blogpost: blogpost
				});
				this.addPost(res);
				this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Blogpost created.', life: 5000 });
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}

			this.showDialog = false;
		}
	}
};
</script>

<style scoped>

</style>
