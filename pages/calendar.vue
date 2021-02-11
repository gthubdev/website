<template>
<div>
	<h1 class="page-headline">
		Calendar
	</h1>
	<div class="p-grid">
		<Event
			v-for="event in data.events"
			:key="event.id"
			:event="event"
			:tz="data.timezones"
		/>
	</div>
</div>
</template>

<script>
import Event from '~/components/calendar/Event';

export default {
	components: {
		Event
	},
	async asyncData({
		$axios
	}) {
		try {
			const res = await $axios.$get('/api/calendar');
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
