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
		this.$root.$on('showToast', msg => {
			this.toastMsg = msg;
			this.showToast = !this.showToast;
		});
	}
};
</script>

<style>
</style>
