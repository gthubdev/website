<template>
<div class="md-layout">
	<FilterPanel />

	<div class="md-layout md-layout-item flex-start">
		<Event
			v-for="event in data.events"
			:key="event.id"
			:event="event"
			:tz="data.tz"
			:active-event="activeEvent"
			@showSessions="showSessions"
		/>
	</div>

	<SidePanel
		:event="activeEvent"
		:show-event="showEvent"
		:tz="data.tz"
		@hideSessions="hideSessions"
	/>
</div>
</template>

<script>
import Event from '~/components/calendar/Event.vue';
import FilterPanel from '~/components/calendar/FilterPanel.vue';
import SidePanel from '~/components/calendar/SidePanel.vue';

export default {
	components: {
		Event,
		FilterPanel,
		SidePanel
	},
	data: function() {
		return {
			data: [],
			activeEvent: null,
			showEvent: false
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
	methods: {
		showSessions: function(event) {
			this.showEvent = true;
			this.activeEvent = event;
		},
		hideSessions: function() {
			this.showEvent = false;
			this.activeEvent = null;
		}
	}
};
</script>

<style lang="scss" scoped>
.flex-start {
	align-content: flex-start;
}
</style>
