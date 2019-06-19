<template>
<div class="md-layout">
	<SidePanel />
	<EventsContainer v-if="activeModel === 'events'"
		:events="data.events"
		:series="data.series"
		:tracks="data.tracks"
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
		this.$root.$on('eventCreated', obj => {
			this.data.events.push(obj);
			this.data.events.sort((a,b) => {
				if (a.priority === b.priority)
					return a.startdate.localeCompare(b.startdate);
				else
					return a.priority - b.priority;
			});
		});
		this.$root.$on('eventDeleted', eventid => {
			let index = this.data.events.findIndex(e => e.id == eventid);
			this.data.events.splice(index, 1);
		});
		// EventSessions
		this.$root.$on('eventSessionCreated', session => {
			let event = this.data.events.find(e => e.id == session.event);
			event.EventSessions.push(session);
			event.EventSessions.sort((a,b) => {
				return a.starttime.localeCompare(b.starttime);
			});
		});
		this.$root.$on('eventSessionUpdated', session => {
			let event = this.data.events.find(e => e.id == session.event);
			let sessionindex = event.EventSessions.findIndex(s => s.id == session.id);
			event.EventSessions.splice(sessionindex, 1, session);
			event.EventSessions.sort((a,b) => {
				return a.starttime.localeCompare(b.starttime);
			});
		});
		this.$root.$on('eventSessionDeleted', (eventid, sessionid) => {
			let event = this.data.events.find(e => e.id == eventid);
			let sessionindex = event.EventSessions.findIndex(s => s.id == sessionid);
			event.EventSessions.splice(sessionindex, 1);
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
		this.$root.$on('seriesUpdated', updatedSeries => {
			let index = this.data.series.findIndex(s => s.id == updatedSeries.id);
			this.data.series.splice(index, 1, updatedSeries);
			this.data.series.sort((a,b) => {
				if (a.priority === b.priority)
					return a.name.localeCompare(b.name);
				else
					return a.priority - b.priority;
			});
		});
		this.$root.$on('seriesDeleted', seriesid => {
			let index = this.data.series.findIndex(s => s.id == seriesid);
			this.data.series.splice(index, 1);
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
		this.$root.$on('trackUpdated', updatedTrack => {
			let index = this.data.tracks.findIndex(t => t.id == updatedTrack.id);
			this.data.tracks.splice(index, 1, updatedTrack);
		});
		this.$root.$on('trackDeleted', trackid => {
			let index = this.data.tracks.findIndex(t => t.id == trackid);
			this.data.tracks.splice(index, 1);
		});
	}
};
</script>

<style lang="scss" scoped>
.main-panel {
	margin-right: 1em !important;
}
</style>
