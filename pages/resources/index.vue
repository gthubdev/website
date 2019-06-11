<template>
<div class="md-layout">
	<SidePanel />
	<div class="md-layout-item flex-start main-panel">
		<EventsContainer v-if="activeModel === 'events'"
			:events="data.events"
		/>
		<SeriesContainer v-if="activeModel === 'series'"
			:series="data.series"
		/>
		<TracksContainer v-else-if="activeModel === 'tracks'"
			:tracks="data.tracks"
		/>
	</div>
</div>
</template>

<script>
import SidePanel from '~/components/resources/SidePanel.vue';
import EventsContainer from '~/components/resources/EventsContainer.vue';
import SeriesContainer from '~/components/resources/SeriesContainer.vue';
import TracksContainer from '~/components/resources/TracksContainer.vue';

export default {
	components: {
		SidePanel, EventsContainer, SeriesContainer, TracksContainer
	},
	data: function() {
		return {
			data: [],
			activeModel: ''
		};
	},
	async asyncData({
		$axios
	}) {
		const resdata = await $axios.$get('/api/calendar');
		return {
			data: resdata
		};
	},
	mounted() {
		// Events
		this.$root.$on('showResourcesEvents', () => {
			this.activeModel = 'events';
		});
		this.$root.$on('eventDeleted', eventid => {
			let index = this.data.events.findIndex(e => e.id == eventid);
			this.data.events.splice(index, 1);
		});
		// Series
		this.$root.$on('showResourcesSeries', () => {
			this.activeModel = 'series';
		});
		// Tracks
		this.$root.$on('showResourcesTracks', () => {
			this.activeModel = 'tracks';
		});
	}
};
</script>

<style lang="scss" scoped>
.main-panel {
	margin-right: 1em !important;
}
</style>
