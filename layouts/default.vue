<template>
<div>
	<!-- Navigation bar -->
	<Nav />
	<!-- Content -->
	<nuxt />

	<!-- General toast -->
	<Toast />
</div>
</template>

<script>
import Nav from '~/components/Nav.vue';

export default {
	components: {
		Nav
	},
	data: function() {
		return {};
	}
};
</script>

<style>
</style>
