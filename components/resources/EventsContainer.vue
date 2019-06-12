<template>
<div class="md-layout-item flex-start main-panel">
	<div class="headline">
		<span class="md-display-1">Events</span>
	</div>
	<md-button class="md-raised md-primary" @click.native="createEvent()">
		Create Event
	</md-button>
	<md-list v-if="events.length > 0">
		<md-list-item v-for="e in events" :key="e.id">
			<span class="md-list-item-text">
				<strong>{{ e.startdate }} - {{ e.enddate }}</strong>
				{{ e.name }}
			</span>
			<md-icon>
				edit
			</md-icon>
			<md-icon @click.native="deleteEvent(e.id)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<CRUDEvent
		:show-dialog="showEventDialog"
		:series="series"
		:tracks="tracks"
	/>
	<CRUDEventSession
		:show-dialog="showSessionDialog"
		:event="createdEvent"
	/>
</div>
</template>

<script>
import CRUDEvent from '~/components/resources/CRUD-Event.vue';
import CRUDEventSession from '~/components/resources/CRUD-EventSession.vue';

export default {
	components: {
		CRUDEvent, CRUDEventSession
	},
	props: {
		events: {
			type: Array,
			default() { return []; }
		},
		series: {
			type: Array,
			default() { return []; }
		},
		tracks: {
			type: Array,
			default() { return []; }
		}
	},
	data: function() {
		return {
			createdEvent: null,
			showEventDialog: false,
			showSessionDialog: false
		};
	},
	mounted() {
		this.$root.$on('toggleCrudEvent', () => {
			this.showEventDialog = !this.showEventDialog;
		});
		this.$root.$on('eventCreated', event => {
			this.createdEvent = event;
			this.showSessionDialog = !this.showSessionDialog;
		});
	},
	methods: {
		async deleteEvent(id) {
			const res = await this.$axios.$post('/api/calendar/event/delete/' + id);
			if (res.deleted >= 1)
				this.$root.$emit('eventDeleted', id);
		},
		createEvent() {
			this.showEventDialog = !this.showEventDialog;
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
