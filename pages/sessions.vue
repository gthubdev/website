<template>
<div>
	<h1 class="page-headline">
		All Sessions
	</h1>
	<p>
		<ul>
			<li v-for="es in data.sessions" :key="es.id">
				{{ es.name }}
				({{ es.Event.name }})
				{{ es.starttime }}
			</li>
		</ul>
	</p>
</div>
</template>

<script>
export default {
	name: 'Sessions',
	async asyncData({
		$axios
	}) {
		try {
			const res = await $axios.$get('/api/allsessions');
			return {
				data: res
			};
		} catch (err) {
			if (err.response)
				alert(err.response);
			return {
				data: []
			};
		}
	},
	data: function() {
		return {
			data: []
		};
	}
};
</script>

<style scoped>

</style>
