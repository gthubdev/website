<template>
<div>
	<!-- Navigation Bar -->
	<Nav />

	<!-- Content -->
	<Nuxt />

	<!-- Toast -->
	<Toast />
</div>
</template>

<script>
import Toast from 'primevue/toast';
import Nav from '~/components/Nav';

export default {
	components: {
		Nav, Toast
	}
};
</script>

<style>
</style>
