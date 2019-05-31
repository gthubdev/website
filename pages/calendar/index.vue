<template>
<div class="md-layout">
	<FilterPanel
		:show-current-events="showCurrentEvents"
	/>

	<div class="md-layout-item flex-start">
		<div class="headline">
			<span class="md-display-1">{{ headline }}</span><br />
		</div>
		<div class="md-layout">
			<Event
				v-for="event in filterEvents()"
				:key="event.id"
				:event="event"
				:tz="data.tz"
				:active-event="activeEvent"
			/>
		</div>
	</div>

	<SidePanel
		:event="activeEvent"
		:show-event="showEvent"
		:tz="data.tz"
	/>

	<CRUDSeries
		:show-dialog="showSeriesDialog"
	/>
	<CRUDTrack
		:show-dialog="showTrackDialog"
	/>
	<CRUDEvent
		:show-dialog="showEventDialog"
		:series="data.series"
		:tracks="data.tracks"
		:tz="data.tz"
	/>
</div>
</template>

<script>
import Event from '~/components/calendar/Event.vue';
import FilterPanel from '~/components/calendar/FilterPanel.vue';
import SidePanel from '~/components/calendar/SidePanel.vue';
import CRUDSeries from '~/components/calendar/CRUD-Series.vue';
import CRUDTrack from '~/components/calendar/CRUD-Track.vue';
import CRUDEvent from '~/components/calendar/CRUD-Event.vue';

import moment from 'moment-timezone';

export default {
	components: {
		Event, FilterPanel,	SidePanel, CRUDSeries, CRUDTrack, CRUDEvent
	},
	data: function() {
		return {
			data: [],
			showCurrentEvents: true,
			activeEvent: null,
			showEvent: false,
			showSeriesDialog: false,
			showTrackDialog: false,
			showEventDialog: false
		};
	},
	computed: {
		headline: function() {
			return this.showCurrentEvents ? 'This week\'s events' : 'All events';
		}
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
		// Event
		this.$root.$on('toggleCrudEvent', () => {
			this.showEventDialog = !this.showEventDialog;
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
		// Series
		this.$root.$on('toggleCrudSeries', () => {
			this.showSeriesDialog = !this.showSeriesDialog;
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
		// Track
		this.$root.$on('toggleCrudTrack', () => {
			this.showTrackDialog = !this.showTrackDialog;
		});
		this.$root.$on('trackCreated', obj => {
			this.data.tracks.push(obj);
			this.data.tracks.sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
		});

		this.$root.$on('toggleCurrentEvents', () => {
			this.showCurrentEvents = !this.showCurrentEvents;
		});
		this.$root.$on('toggleSessions', event => {
			if (!this.showEvent) {
				this.showEvent = true;
				this.activeEvent = event;
			} else {
				this.showEvent = false;
				this.activeEvent = null;
			}
		});
	},
	methods: {
		filterEvents: function() {
			if (this.showCurrentEvents)
				return this.data.events.filter(function(event) {
					return moment(event.startdate).isBefore('2019-07-01');
				});
			else
				return this.data.events;
		}
	}
};
</script>

<style lang="scss" scoped>
.flex-start {
	align-content: flex-start;
}
.headline {
	padding: 1em;
}
</style>
