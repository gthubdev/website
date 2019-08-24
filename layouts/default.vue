<template>
<div>
	<div>
		<Nav />
	</div>
	<nuxt />
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

body {
	overflow-y: hidden;
	background:linear-gradient(rgba(28, 36, 43, 0.92),rgba(28, 36, 43, 0.92)),
		url('~assets/img/SiteBackground.jpg');
	background-size: cover;
	background-position: center;
}
</style>
