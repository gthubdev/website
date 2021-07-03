<template>
<main
	class="w-screen h-screen bg-gray-100 text-gray-800"
>
	<Nuxt	/>
	<Toast />
</main>
</template>

<script>
import Toast from 'primevue/toast';

export default {
	components: {
		Toast
	}
};
</script>
