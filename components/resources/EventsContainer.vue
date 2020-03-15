<template>
<!--<div class="md-layout-item flex-start main-panel">
	<div class="md-layout headline">
		<div class="md-layout-item md-display-1">
			Events
		</div>

		<div class="md-layout-item">
			<md-field md-clearable>
				<label>Search term</label>
				<md-input v-model="searchTerm" />
			</md-field>
		</div>

		<div class="md-layout-item align-right">
			<md-button class="md-raised md-primary btn-primary" @click.native="createEvent()">
				Create Event
			</md-button>
		</div>
	</div>
	<md-button class="md-raised md-primary" :class="showCurrentEvents ? 'btn-primary' : 'btn-secondary'" @click.native="showCurrentEvents = true; pageClicked(1); setArrays()">
		Current Events
	</md-button>
	<md-button class="md-raised md-primary" :class="showCurrentEvents ? 'btn-secondary' : 'btn-primary'" @click.native="showCurrentEvents = false; pageClicked(1); setArrays();">
		Past events
	</md-button>

	<md-list v-if="events.length > 0">
		<md-list-item v-for="e in filterEvents()" :key="e.id">
			<div class="icon">
				<div v-if="!shownSessions.includes(e.id) && e.EventSessions.length">
					<md-icon>
						chevron_right
					</md-icon>
				</div>
				<div v-else class="invisible">
					<md-icon>
						expand_less
					</md-icon>
				</div>
			</div>
			<div class="md-list-item-text">
				<span @click="toggleSessions(e.id)">
					<strong>{{ e.name }}</strong><br />
					{{ e.startdate }} - {{ e.enddate }}
				</span>
				<span v-if="shownSessions.includes(e.id) && e.EventSessions.length" class="sessions">
					<md-list>
						<md-list-item v-for="s in e.EventSessions" :key="s.id">
							<strong>{{ sessionStart(s, e) }} {{ s.name }} ({{ s.Series.name }})</strong>
							<md-icon @click.native="updateEventSession(e, s)">
								edit
							</md-icon>
							<md-icon @click.native="deleteSession(s)">
								delete
							</md-icon>
						</md-list-item>
					</md-list>
				</span>
			</div>
			<md-icon @click.native="createEventSession(e)">
				add_circle
			</md-icon>
			<md-icon @click.native="updateEvent(e)">
				edit
			</md-icon>
			<md-icon @click.native="getIcal(e.id)">
				calendar_today
			</md-icon>
			<md-icon @click.native="deleteEvent(e)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<div v-if="showPagination">
		<paginate
			v-model="pageNumber"
			:page-count="pageCount"
			:click-handler="pageClicked"
			:no-li-surround="true"
			:container-class="'pag-container'"
			:active-class="'pag-active'"
			:page-link-class="'pag-page-link'"
			:hide-prev-next="true"
		/>
	</div>

	<CRUDEvent
		:show-dialog="showEventDialog"
		:active-event="activeEvent"
		:series="series"
		:tracks="tracks"
		:mode="mode"
	/>
	<CRUDEventSession
		:show-dialog="showSessionDialog"
		:event="activeEvent"
		:active-session="activeEventSession"
		:mode="mode"
	/>
</div>-->
<div>
	<div class="p-grid p-align-center">
		<div class="p-col-4">
			<h2>
				Events
			</h2>
		</div>
		<div class="p-col-4">
			<span class="p-float-label">
				<InputText id="searchTerm" v-model="searchTerm" type="text" class="full-width" />
				<label for="searchTerm">Search term</label>
			</span>
		</div>
		<div class="p-col-4 align-right">
			<Button label="CREATE EVENT" class="p-button-raised" @click="createEvent()" />
		</div>
	</div>

	<DataView :value="shownEvents" paginator-position="bottom" :paginator="true" :rows="itemsPerPage" :always-show-paginator="false">
		<template #list="slotProps">
			<div class="p-grid p-align-center">
				<div class="p-col-9">
					<b>{{ slotProps.data.name }}</b>
				</div>
				<div class="p-col-3 align-right">
					<Button icon="pi pi-pencil" disabled="true" @click="updateEvent(slotProps.data)" />
					&nbsp; &nbsp;
					<Button icon="pi pi-trash" @click="deleteEvent(slotProps.data)" />
				</div>
			</div>
		</template>
	</DataView>

	<CreateEvent
		:show-dialog="showCreateEventDialog"
		:series="series"
		:tracks="tracks"
	/>
</div>
</template>

<script>
//import moment from 'moment';
import { constants, strings } from '~/plugins/constants';
import CreateEvent from '~/components/resources/event/Create-Event.vue';

export default {
	components: {
		CreateEvent
	},
	props: {
		events: {
			type: Array, default() { return []; }
		},
		series: {
			type: Array, default() { return []; }
		},
		tracks: {
			type: Array, default() { return []; }
		}
	},
	data: function() {
		return {
			showDialog: false,
			showSessionDialog: false,
			showCreateEventDialog: false,
			showUpdateEventDialog: false,
			activeEvent: null,
			activeEventSession: null,
			searchTerm: '',
			shownEvents: null,
			itemsPerPage: constants.ITEMS_PER_PAGE_EVENTS
		};
	},
	watch: {
		searchTerm(newValue) {
			if (newValue.trim() === '')
				this.shownEvents = this.events;
			else
				this.shownEvents = this.events.filter(e => {
					return e.name.toLowerCase().includes(newValue.toLowerCase());
				});
		}
	},
	mounted() {
		// set the events
		this.shownEvents = this.events;

		this.$root.$on(strings.CLOSED_CRUD_EVENT, () => {
			this.showCreateEventDialog = false;
			this.showUpdateEventDialog = false;
		});
		//
		// this.$root.$on(strings.TOGGLE_CRUD_EVENT, () => {
		// 	this.showEventDialog = !this.showEventDialog;
		// });
		// this.$root.$on(strings.TOGGLE_CRUD_EVENTSESSION, () => {
		// 	this.showSessionDialog = !this.showSessionDialog;
		// });
		// this.$root.$on(strings.EVENT_CREATED, event => {
		// 	this.activeEvent = event;
		// 	this.showSessionDialog = !this.showSessionDialog;
		// });

		// set the arrays
		// this.setArrays();
	},
	methods: {
		createEvent() {
			this.showUpdateEventDialog = false;
			this.showCreateEventDialog = true;
		},
		// createEventSession(event) {
		// 	this.activeEvent = event;
		// 	this.mode = 'create';
		// 	this.showSessionDialog = !this.showSessionDialog;
		// },
		// updateEvent(event) {
		// 	this.activeEvent = event;
		// 	this.mode = 'update';
		// 	this.showEventDialog = !this.showEventDialog;
		// },
		// updateEventSession(event, session) {
		// 	this.activeEvent = event;
		// 	this.activeEventSession = session;
		// 	this.mode = 'update';
		// 	this.showSessionDialog = !this.showSessionDialog;
		// },
		deleteEvent(event) {
			this.$root.$emit(strings.CONFIRM_DELETE_EVENT, event);
		},
		// deleteSession(session) {
		// 	this.$root.$emit(strings.CONFIRM_DELETE_EVENTSESSION, session);
		// },
		// toggleSessions(id) {
		// 	if (this.shownSessions.includes(id)) {
		// 		let index = this.shownSessions.findIndex(e => e == id);
		// 		this.shownSessions.splice(index, 1);
		// 	} else {
		// 		this.shownSessions.push(id);
		// 	}
		// },
		// sessionStart(session, event) {
		// 	return moment(session.starttime).tz(event.Track.timezone).format('ddd Do HH:mm')+'h';
		// },
		// async getIcal(eventid) {
		// 	try {
		// 		const res = await this.$axios.$get('/api/calendar/ical/event/' + eventid);
		// 		let blob = new Blob([res.toString()], { type: 'text/calendar' });
		// 		let link = document.createElement('a');
		// 		link.href = window.URL.createObjectURL(blob);
		// 		link.download = 'cal.ics';
		// 		link.click();
		// 	} catch(err) {
		// 		if (err.response)
		// 			alert(err.response);
		// 	}
		// },
		// setArrays() {
		// 	// methods splits the events in current and past events
		// 	this.currentEvents = this.events.filter(event => {
		// 		return moment(event.enddate).isSameOrAfter(moment().format('YYYY-MM-DD'));
		// 	});
		// 	this.pastEvents = this.events.filter(event => {
		// 		return moment(event.enddate).isBefore(moment().format('YYYY-MM-DD'));
		// 	});
		//
		// 	if (this.showCurrentEvents === true)
		// 		this.pageCount = Math.ceil(this.currentEvents.length / this.itemsPerPage);
		// 	else
		// 		this.pageCount = Math.ceil(this.pastEvents.length / this.itemsPerPage);
		//
		// 	this.showPagination = this.pageCount > 1;
		// }
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
