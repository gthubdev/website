<template>
<div class="md-layout">
	<SidePanel />
	<div class="md-layout-item flex-start">
		<div class="headline">
			<span class="md-display-1">Series</span>
		</div>
		<SeriesContainer
			:series="data.series"
		/>
	</div>
</div>
</template>

<script>
import SidePanel from '~/components/resources/SidePanel.vue';
import SeriesContainer from '~/components/resources/SeriesContainer.vue';

export default {
	components: {
		SidePanel, SeriesContainer
	},
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
