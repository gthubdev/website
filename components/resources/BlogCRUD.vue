<template>
<Dialog :header="headline" :visible.sync="showBlogDialog" :modal="true">
	<div class="flex flex-row">
		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="headline" v-model="blogpost.headline" type="text" />
				<label for="headline">Headline</label>
			</span>
		</div>

		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="image" v-model="blogpost.image" type="text" />
				<label for="image">Featured image</label>
			</span>
		</div>
	</div>

	<Editor v-model="editorContent" editor-style="height: 320px" />

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-else :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Editor from 'primevue/editor';
import { mapState } from 'vuex';

export default {
	components: {
		Dialog, Editor
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		isEditing: {
			type: Boolean, default: false
		},
		editingPost: {
			type: Object, default: null
		}
	},
	data() {
		return {
			showBlogDialog: false,
			action: '',
			headline: '',
			blogpost: {
				id: '',
				headline: '',
				content: '',
				image: ''
			},
			editorContent: ''
		};
	},
	computed: {
		...mapState('auth', ['loggedIn', 'user'])
	},
	watch: {
		showDialog(newValue) {
			this.showBlogDialog = newValue;
		},
		showBlogDialog(newValue) {
			if (newValue === false)
				this.$emit('blog-crud-closed');

			if (newValue === true && this.isEditing === false) {
				this.action = 'Create';
				this.headline = 'Create a blogpost';
				this.blogpost = {
					id: '',
					headline: '',
					content: '',
					image: ''
				};
				this.editorContent = '';
			}

			if (newValue === true && this.isEditing === true) {
				this.action = 'Update';
				this.headline = 'Update ' + this.editingPost.headline;
				this.blogpost = {
					id: this.editingPost.id,
					headline: this.editingPost.headline,
					content: '',
					image: this.editingPost.image
				};
				this.editorContent = this.editingPost.content;
			}
		}
	},
	created() {
		this.showBlogDialog = this.showDialog;
	},
	methods: {
		close() {
			this.showBlogDialog = false;
		},
		sendRequest() {
			this.blogpost.author = this.user.id;
			this.blogpost.content = this.editorContent;
			// 	.replace('[quote]', '<div class="quote">')
			// 	.replace('[/quote]', '</div>');
			this.$emit('send-request', this.blogpost);
			console.log('sending request');
		},
		validInput() {
			return this.validHeadline() &&
				this.validImage() &&
				this.validContent();
		},
		validHeadline() {
			return this.blogpost.headline !== undefined && this.blogpost.headline.length > 0;
		},
		validImage() {
			return this.blogpost.image.trim() === '' ||
				this.blogpost.image.startsWith('https://') ||
				this.blogpost.image.startsWith('http://');
		},
		validContent() {
			return this.editorContent !== undefined && this.editorContent.length > 0;
		}
	}
};
</script>

<style scoped>

</style>
