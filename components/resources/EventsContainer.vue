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
</div>
</template>

<script>
import CRUDEvent from '~/components/resources/CRUD-Event.vue';
import CRUDEventSession from '~/components/resources/CRUD-EventSession.vue';
import Paginate from 'vuejs-paginate/src/components/Paginate.vue';
import moment from 'moment';
import { constants } from '~/plugins/constants';

export default {
	components: {
		CRUDEvent, CRUDEventSession, Paginate
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
			currentEvents: [],
			pastEvents: [],
			showEventDialog: false,
			showSessionDialog: false,
			shownSessions: [],
			activeEvent: null,
			activeEventSession: null,
			showCurrentEvents: true,
			mode: '',
			searchTerm: '',
			showPagination: false,
			pageNumber: 1,
			pageCount: 1,
			itemsPerPage: constants.ITEMS_PER_PAGE_EVENTS
		};
	},
	watch: {
		events(newValue) {
			if (newValue === undefined || !newValue.length) return;

			this.setArrays();
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

		// set the arrays
		this.setArrays();
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
		sessionStart(session, event) {
			return moment(session.starttime).tz(event.Track.timezone).format('ddd Do HH:mm')+'h';
		},
		async getIcal(eventid) {
			try {
				const res = await this.$axios.$get('/api/calendar/ical/event/' + eventid);
				let blob = new Blob([res.toString()], { type: 'text/calendar' });
				let link = document.createElement('a');
				link.href = window.URL.createObjectURL(blob);
				link.download = 'cal.ics';
				link.click();
			} catch(err) {
				if (err.response)
					alert(err.response);
			}
		},
		filterEvents() {
			let arr = [], res_arr = [], nrMatches = 0;
			if (this.showCurrentEvents === true)
				arr = this.currentEvents;
			else
				arr = this.pastEvents;

			// count number of elements matching
			if (this.searchTerm.trim() === '') {
				nrMatches = arr.length;
			} else {
				arr.forEach(e => {
					if (e.name.toLowerCase().includes(this.searchTerm.trim()))
						nrMatches++;
				});
			}

			// do the actual filtering
			for (let i = (this.pageNumber - 1) * this.itemsPerPage; i < arr.length && res_arr.length < this.itemsPerPage; i++) {
				if (this.searchTerm.trim() === '')
					res_arr.push(arr[i]);
				else if (arr[i].name.toLowerCase().includes(this.searchTerm.trim()))
					res_arr.push(arr[i]);
			}

			this.pageCount = Math.ceil(nrMatches / this.itemsPerPage);
			this.showPagination = this.pageCount > 1;
			return res_arr;
		},
		pageClicked(newPageNum) {
			console.log('Active Page: ' + newPageNum);
			this.pageNumber = newPageNum;
		},
		setArrays() {
			// methods splist the events in current and past events
			this.currentEvents = this.events.filter(event => {
				return moment(event.enddate).isSameOrAfter(moment().format('YYYY-MM-DD'));
			});
			this.pastEvents = this.events.filter(event => {
				return moment(event.enddate).isBefore(moment().format('YYYY-MM-DD'));
			});

			if (this.showCurrentEvents === true)
				this.pageCount = Math.ceil(this.currentEvents.length / this.itemsPerPage);
			else
				this.pageCount = Math.ceil(this.pastEvents.length / this.itemsPerPage);

			this.showPagination = this.pageCount > 1;
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
.icon {
	margin-right: .5em;
}
.invisible {
	visibility: hidden;
}
</style>
