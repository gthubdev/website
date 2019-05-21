<template>
<div>
	{{ data }}
</div>
</template>

<script>
export default {
	data: function() {
		return {
			data: []
		};
	},
	async asyncData({
		$axios
	}) {
		const resdata = await $axios.$get('/api/calendar');
		return {
			data: resdata
		};
	}
};
</script>
