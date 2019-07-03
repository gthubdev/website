<template>
<div>
	<div>
		<Nav />
	</div>
	<nuxt />
</div>
</template>

<script>
import Vue from 'vue';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default-dark.css';
import Nav from '~/components/Nav.vue';

Vue.use(VueMaterial);

export default {
	components: {
		Nav
	}
};
</script>

<style>

</style>
