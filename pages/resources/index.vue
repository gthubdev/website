<template>
<div class="md-layout">
	<SidePanel />
	<EventsContainer v-if="activeModel === 'events'"
		:events="data.events"
	/>
	<SeriesContainer v-else-if="activeModel === 'series'"
		:series="data.series"
	/>
	<TracksContainer v-else-if="activeModel === 'tracks'"
		:tracks="data.tracks"
		:tz="data.tz"
	/>
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
		this.$root.$on('seriesCreated', obj => {
			this.data.series.push(obj);
			this.data.series.sort((a,b) => {
				if (a.priority === b.priority)
					return a.name.localeCompare(b.name);
				else
					return a.priority - b.priority;
			});
		});
		// Tracks
		this.$root.$on('showResourcesTracks', () => {
			this.activeModel = 'tracks';
		});
		this.$root.$on('trackCreated', obj => {
			this.data.tracks.push(obj);
			this.data.tracks.sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
		});
	}
};
</script>

<style lang="scss" scoped>
.main-panel {
	margin-right: 1em !important;
}
</style>
