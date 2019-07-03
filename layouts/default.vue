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

body {
	overflow-y: hidden;
	background:linear-gradient(rgba(28, 36, 43, 0.92),rgba(28, 36, 43, 0.92)),
		url('/img/WVL2689.jpg');
	background-size: cover;
	background-position: center;
}
</style>
