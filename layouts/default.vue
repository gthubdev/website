<template>
<div>
	<!-- Navigation bar -->
	<Nav />
	<!-- Content -->
	<nuxt />

	<!-- General toast -->
	<md-snackbar :md-active.sync="showToast" md-persistent>
		<span>{{ toastMsg }}</span>
	</md-snackbar>
</div>
</template>

<script>
import Nav from '~/components/Nav.vue';
import { strings } from '~/plugins/constants';

export default {
	components: {
		Nav
	},
	data: function() {
		return {
			showToast: false,
			toastMsg: ''
		};
	},
	mounted() {
		this.$root.$on(strings.SHOW_TOAST, msg => {
			this.toastMsg = msg;
			this.showToast = !this.showToast;
		});
	}
};
</script>

<style>
</style>
