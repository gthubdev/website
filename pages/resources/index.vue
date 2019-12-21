<template>
<div class="md-layout">
	<md-tabs md-alignment="fixed" :md-dynamic-height="true" class="md-transparent">
		<md-tab id="tab-events" md-label="Events">
			<EventsContainer
				:events="data.events"
				:series="data.series"
				:tracks="data.tracks"
			/>
		</md-tab>
		<md-tab id="tab-series" md-label="Series">
			<SeriesContainer
				:series="data.series"
				:vehicleclasses="data.vehicleclasses"
			/>
		</md-tab>
		<md-tab id="tab-tracks" md-label="Tracks">
			<TracksContainer
				:tracks="data.tracks"
				:tz="data.tz"
			/>
		</md-tab>
	</md-tabs>
	<md-dialog-confirm
		:md-active.sync="confirmDelete.showDialog"
		md-title="Are you sure ?"
		:md-content="confirmDelete.content"
		md-confirm-text="Delete"
		md-cancel-text="Cancel"
		@md-confirm="deleteResource(confirmDelete.type, confirmDelete.resource)"
	/>
</div>
</template>

<script>
import EventsContainer from '~/components/resources/EventsContainer.vue';
import SeriesContainer from '~/components/resources/SeriesContainer.vue';
import TracksContainer from '~/components/resources/TracksContainer.vue';
import { strings } from '~/plugins/constants';

export default {
	components: {
		EventsContainer, SeriesContainer, TracksContainer
	},
	async asyncData({
		$axios
	}) {
		try {
			const resdata = await $axios.$get('/api/calendar');
			return {
				data: resdata
			};
		} catch(err) {
			if (err.response)
			alert(err.response);
			return {
				data: []
			};
		}
	},
	data: function() {
		return {
			data: [],
			confirmDelete: {
				showDialog: false,
				type: '',
				resource: {},
				content: ''
			}
		};
	},
	mounted() {
		// Events
		this.$root.$on(strings.EVENT_CREATED, obj => {
			this.data.events.push(obj);
			this.data.events.sort((a,b) => {
				if (a.priority === b.priority)
					return a.startdate.localeCompare(b.startdate);
				else
					return a.priority - b.priority;
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Event ' + obj.name + ' created');
		});
		this.$root.$on(strings.EVENT_UPDATED, event => {
			let index = this.data.events.findIndex(e => e.id == event.id);
			this.data.events.splice(index, 1, event);
			this.data.events.sort((a,b) => {
				if (a.priority === b.priority)
					return a.startdate.localeCompare(b.startdate);
				else
					return a.priority - b.priority;
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Event ' + event.name + ' updated');
		});
		this.$root.$on(strings.CONFIRM_DELETE_EVENT, event => {
			this.confirmDelete.type = 'event';
			this.confirmDelete.resource = event;
			this.confirmDelete.content = 'Do you really want to delete the Event \"' + event.name + '\" ?';
			this.confirmDelete.showDialog = !this.confirmDelete.showDialog;
		});
		// EventSessions
		this.$root.$on(strings.EVENTSESSION_CREATED, session => {
			let event = this.data.events.find(e => e.id == session.event);
			event.EventSessions.push(session);
			event.EventSessions.sort((a,b) => {
				return a.starttime.localeCompare(b.starttime);
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Session ' + session.name + ' created');
		});
		this.$root.$on(strings.EVENTSESSION_UPDATED, session => {
			let event = this.data.events.find(e => e.id == session.event);
			let sessionindex = event.EventSessions.findIndex(s => s.id == session.id);
			event.EventSessions.splice(sessionindex, 1, session);
			event.EventSessions.sort((a,b) => {
				return a.starttime.localeCompare(b.starttime);
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Session ' + session.name + ' updated');
		});
		this.$root.$on(strings.CONFIRM_DELETE_EVENTSESSION, (session) => {
			this.confirmDelete.type = 'eventsession';
			this.confirmDelete.resource = session;
			this.confirmDelete.content = 'Do you really want to delete the Session \"' + session.name + '\" ?';
			this.confirmDelete.showDialog = !this.confirmDelete.showDialog;
		});
		// Series
		this.$root.$on(strings.SERIES_CREATED, obj => {
			this.data.series.push(obj);
			this.data.series.sort((a,b) => {
				if (a.priority === b.priority)
					return a.name.localeCompare(b.name);
				else
					return a.priority - b.priority;
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Series ' + obj.name + ' created');
		});
		this.$root.$on(strings.SERIES_UPDATED, updatedSeries => {
			let index = this.data.series.findIndex(s => s.id == updatedSeries.id);
			this.data.series.splice(index, 1, updatedSeries);
			this.data.series.sort((a,b) => {
				if (a.priority === b.priority)
					return a.name.localeCompare(b.name);
				else
					return a.priority - b.priority;
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Series ' + updatedSeries.name + ' updated');
		});
		this.$root.$on(strings.CONFIRM_DELETE_SERIES, series => {
			this.confirmDelete.type = 'series';
			this.confirmDelete.resource = series;
			this.confirmDelete.content = 'Do you really want to delete the Series \"' + series.name + '\" ?';
			this.confirmDelete.showDialog = !this.confirmDelete.showDialog;
		});
		// Tracks
		this.$root.$on(strings.TRACK_CREATED, obj => {
			this.data.tracks.push(obj);
			this.data.tracks.sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
			this.$root.$emit(strings.SHOW_TOAST, 'Track ' + obj.name + ' created');
		});
		this.$root.$on(strings.TRACK_UPDATED, updatedTrack => {
			let index = this.data.tracks.findIndex(t => t.id == updatedTrack.id);
			this.data.tracks.splice(index, 1, updatedTrack);
			this.$root.$emit(strings.SHOW_TOAST, 'Track ' + updatedTrack.name + ' updated');
		});
		this.$root.$on(strings.CONFIRM_DELETE_TRACK, track => {
			this.confirmDelete.type = 'track';
			this.confirmDelete.resource = track;
			this.confirmDelete.content = 'Do you really want to delete the Track \"' + track.name + '\" ?';
			this.confirmDelete.showDialog = !this.confirmDelete.showDialog;
		});
	},
	methods: {
		async deleteResource(type, resource) {
			try {
				const res = await this.$axios.$post('/api/calendar/' + type + '/delete/' + resource.id);
				if (res.deleted >= 1) {
					switch (type) {
						case 'event': this.eventDeleted(resource.id); break;
						case 'eventsession': this.eventSessionDeleted(resource.id); break;
						case 'series': this.seriesDeleted(resource.id); break;
						case 'track': this.trackDeleted(resource.id); break;
						default: alert('Something is fucked. Please call the SRO Press Office.');
					}
				}
			} catch(err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
				else if (err.response)
					alert(err.response);
			}
		},
		eventDeleted(eventid) {
			let index = this.data.events.findIndex(e => e.id == eventid);
			let event = this.data.events.find(e => e.id == eventid);
			this.data.events.splice(index, 1);
			this.$root.$emit(strings.SHOW_TOAST, 'Event ' + event.name + ' deleted');
		},
		eventSessionDeleted(sessionid) {
			let event = this.findEventBySessionId(sessionid);
			let sessionindex = event.EventSessions.findIndex(s => s.id == sessionid);
			let session = event.EventSessions.find(s => s.id == sessionid);
			event.EventSessions.splice(sessionindex, 1);
			this.$root.$emit(strings.SHOW_TOAST, 'Session ' + session.name + ' deleted');
		},
		seriesDeleted(seriesid) {
			let index = this.data.series.findIndex(s => s.id == seriesid);
			let series = this.data.series.find(s => s.id == seriesid);
			this.data.series.splice(index, 1);
			this.$root.$emit(strings.SHOW_TOAST, 'Series ' + series.name + ' deleted');
		},
		trackDeleted(trackid) {
			let index = this.data.tracks.findIndex(t => t.id == trackid);
			let track = this.data.tracks.find(t => t.id == trackid);
			this.data.tracks.splice(index, 1);
			this.$root.$emit(strings.SHOW_TOAST, 'Track ' + track.name + ' deleted');
		},
		findEventBySessionId(sessionid) {
			for (let i = 0; i < this.data.events.length; i++) {
				for (let j = 0; j < this.data.events[i].EventSessions.length; j++) {
					if (this.data.events[i].EventSessions[j].id == sessionid)
						return this.data.events[i];
				}
			}
		}
	},
	middleware: 'auth'
};
</script>

<style lang="scss" scoped>
.main-panel {
	// margin-right: 1em !important;
	padding-top: 2em;
}
.md-layout {
	margin: 2em 10em 2em 10em !important;
}
.md-tabs {
	margin: 0 0 0 0 !important;
}
.md-tabs {
	width: 100%;
}
.md-dialog {
	z-index: 125;
}
</style>
