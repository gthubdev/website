<template>
<div class="md-layout-item flex-start main-panel">
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
	<md-button class="md-raised md-primary" :class="showCurrentEvents ? 'btn-primary' : 'btn-secondary'" @click.native="showCurrentEvents = true">
		Current Events
	</md-button>
	<md-button class="md-raised md-primary" :class="showCurrentEvents ? 'btn-secondary' : 'btn-primary'" @click.native="showCurrentEvents = false">
		Past events
	</md-button>

	<md-list v-if="events.length > 0">
		<md-list-item v-for="e in filterEvents" :key="e.id">
			<div class="md-list-item-text">
				<span @click="toggleSessions(e.id)">
					<strong>{{ e.name }}</strong><br />
					{{ e.startdate }} - {{ e.enddate }}
				</span>
				<span v-if="shownSessions.includes(e.id) && e.EventSessions.length" class="sessions">
					<md-list>
						<md-list-item v-for="s in e.EventSessions" :key="s.id">
							<strong>{{ sessionStart(s.starttime) }} {{ s.name }} ({{ s.Series.name }})</strong>
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
</div>
</template>

<script>
import CRUDEvent from '~/components/resources/CRUD-Event.vue';
import CRUDEventSession from '~/components/resources/CRUD-EventSession.vue';
import moment from 'moment';

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
			showEventDialog: false,
			showSessionDialog: false,
			shownSessions: [],
			activeEvent: null,
			activeEventSession: null,
			showCurrentEvents: true,
			mode: '',
			searchTerm: ''
		};
	},
	computed: {
		filterEvents() {
			if (this.showCurrentEvents === true)
				return this.events.filter(event => {
					return moment(event.enddate).isSameOrAfter(moment().format('YYYY-MM-DD')) &&
					event.name.toLowerCase().includes(this.searchTerm.trim());
				});
			else
				return this.events.filter(event => {
					return moment(event.enddate).isBefore(moment().format('YYYY-MM-DD')) &&
					event.name.toLowerCase().includes(this.searchTerm.trim());
				});
		}
	},
	mounted() {
		this.$root.$on('toggleCrudEvent', () => {
			this.showEventDialog = !this.showEventDialog;
		});
		this.$root.$on('toggleCrudEventSession', () => {
			this.showSessionDialog = !this.showSessionDialog;
		});
		this.$root.$on('eventCreated', event => {
			this.activeEvent = event;
			this.showSessionDialog = !this.showSessionDialog;
		});
	},
	methods: {
		createEvent() {
			this.mode = 'create';
			this.showEventDialog = !this.showEventDialog;
		},
		createEventSession(event) {
			this.activeEvent = event;
			this.mode = 'create';
			this.showSessionDialog = !this.showSessionDialog;
		},
		updateEvent(event) {
			this.activeEvent = event;
			this.mode = 'update';
			this.showEventDialog = !this.showEventDialog;
		},
		updateEventSession(event, session) {
			this.activeEvent = event;
			this.activeEventSession = session;
			this.mode = 'update';
			this.showSessionDialog = !this.showSessionDialog;
		},
		deleteEvent(event) {
			this.$root.$emit('confirmDeleteEvent', event);
		},
		deleteSession(session) {
			this.$root.$emit('confirmDeleteEventSession', session);
		},
		toggleSessions(id) {
			if (this.shownSessions.includes(id)) {
				let index = this.shownSessions.findIndex(e => e == id);
				this.shownSessions.splice(index, 1);
			} else {
				this.shownSessions.push(id);
			}
		},
		sessionStart(starttime) {
			return moment(starttime).format('ddd Do HH:mm')+'h';
		},
		async getIcal(eventid) {
			try {
				const res = await this.$axios.$get('/api/ical/event/' + eventid);
				let blob = new Blob([res.toString()], { type: 'text/calendar' });
				let link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = 'cal.ics';
				link.click();
			} catch(err) {
				if (err.response)
					alert(err.response);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
.sessions {
	padding-left: 2em
}
.md-list {
	background-color: rgba(0, 0, 0, 0.3);
	margin-top: 0.5em;
	border-radius: 20px;
}
</style>
