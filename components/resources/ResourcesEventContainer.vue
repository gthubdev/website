<template>
<div class="resources">
	<div class="resources-top-bar">
		<div>
			<span class="p-input-icon-left">
				<i class="pi pi-search" />
				<InputText id="eventSearchTerm" v-model="searchTerm" type="text" />
			</span>
		</div>
		<div>
			<Button label="CREATE EVENT" class="p-button-raised" @click="openEventCrud()" />
		</div>
	</div>
	<div>
		<DataView
			:value="displayedEvents"
			paginator-position="bottom"
			:paginator="true"
			:rows="5"
			:always-show-paginator="false"
		>
			<template #list="slotProps">
				<div class="resource-list-item-container">
					<div class="grid grid-rows-2 grid-flow-col items-center justify-between">
						<div class="text-lg font-bold">
							{{ slotProps.data.name }}
						</div>
						<div class="pl-6 pt-1 grid grid-cols-3 gap-4">
							<div>
								<span v-if="displayedSessions.includes(slotProps.data.id) && slotProps.data.EventSessions.length">
									<i class="pi pi-angle-down" style="fontSize: 1.5rem" @click="toggleDisplayedSession(slotProps.data.id)" />
								</span>
								<span v-else>
									<i class="pi pi-angle-right" style="fontSize: 1.5rem" @click="toggleDisplayedSession(slotProps.data.id)" />
								</span>
							</div>
							<div class="grid grid-flow-row auto-rows-max">
								<div>
									{{ eventDate(slotProps.data) }}
								</div>
								<div v-if="displayedSessions.includes(slotProps.data.id) && slotProps.data.EventSessions.length" class="pl-10">
									<div
										v-for="es in slotProps.data.EventSessions"
										:key="es.id"
									>
										<i class="pi pi-trash mr-1" style="fontSize: 1.0rem" @click="sendDeleteEventSessionRequest(slotProps.data.id, es)" />
										{{ es.name }} ({{ sessionStart(es, slotProps.data.Track.timezone) }})
									</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<Button icon="pi pi-pencil" @click="editEvent(slotProps.data)" />
						<Button icon="pi pi-trash" @click="sendDeleteEventRequest(slotProps.data)" />
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<ResourcesEventCRUD
		:show-dialog="showEventDialog"
		:is-editing="isEditing"
		:editing-event="editingEvent"
		@event-crud-closed="closeEventCrud"
		@send-request="sendRequest"
	/>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: {
		DataView, InputText
	},
	data: function() {
		return {
			searchTerm: '',
			displayedEvents: [],
			displayedSessions: [],
			showEventDialog: false,
			isEditing: false,
			editingEvent: null
		};
	},
	computed: {
		...mapGetters({
			events: 'resources/events/get'
		})
	},
	watch: {
		searchTerm(newvalue) {
			if (newvalue.trim() === '')
				this.displayedEvents = [...this.events];
			else
				this.displayedEvents = this.events.filter(t => {
					return t.name.toLowerCase().includes(newvalue.toLowerCase());
				});
		}
	},
	created() {
		this.displayedEvents = this.events;
	},
	methods: {
		...mapMutations({
			addEvent: 'resources/events/add',
			deleteEvent: 'resources/events/delete',
			deleteEventSession: 'resources/events/deleteSession',
			updateEvent: 'resources/events/update'
		}),
		openEventCrud() {
			this.showEventDialog = true;
		},
		closeEventCrud() {
			this.isEditing = false;
			this.showEventDialog = false;
			this.editingEvent = null;
		},
		startdate(event) {
			return this.$dayjs(event.startdate).format('ddd Do MMM');
		},
		enddate(event) {
			return this.$dayjs(event.enddate).format('ddd Do MMM');
		},
		sessionStart(session, timezone) {
			return this.$dayjs(session.starttime).tz(timezone).format('ddd Do MMM - HH:mm') + 'h';
		},
		eventDate(event) {
			if (event.startdate === event.enddate)
				return this.startdate(event);
			else
				return this.startdate(event) + ' - ' + this.enddate(event);
		},
		toggleDisplayedSession(eventid) {
			if (this.displayedSessions.includes(eventid)) {
				const index = this.displayedSessions.findIndex(e => e.id === eventid);
				this.displayedSessions.splice(index, 1);
			} else {
				this.displayedSessions.push(eventid);
			}
		},
		editEvent(event) {
			this.isEditing = true;
			this.editingEvent = JSON.parse(JSON.stringify(event));
			this.showEventDialog = true;
		},
		async sendDeleteEventRequest(event) {
			try {
				const res = await this.$axios.$post('api/calendar/event/delete/' + event.id);
				if (res.deleted >= 1) {
					this.deleteEvent(event.id);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Event ' + event.name + ' deleted.', life: 5000 });
				}
			} catch (err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
				else if (err.response)
					alert(err.response);
			}
		},
		async sendDeleteEventSessionRequest(eventid, session) {
			try {
				const res = await this.$axios.$post('api/calendar/eventsession/delete/' + session.id);
				if (res.deleted >= 1) {
					this.deleteEventSession({ eventid: eventid, sessionid: session.id });
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Session ' + session.name + ' deleted.', life: 5000 });
				}
			} catch (err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
				else if (err.response)
					alert(err.response);
			}
		},
		async sendRequest(obj) {
			const event = JSON.parse(JSON.stringify(obj));
			delete event.createdAt;
			let url;
			if (this.isEditing === false)
				url = '/api/calendar/event/create';
			else if (this.isEditing === true && this.editingEvent !== null)
				url = '/api/calendar/event/update/' + this.editingEvent.id;
			else
				console.error('Sending request for null-event');

			try {
				const res = await this.$axios.$post(url, {
					event
				});
				if (this.isEditing === false) {
					this.addEvent(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Event ' + event.name + ' created.', life: 5000 });
				} else {
					this.updateEvent(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Event ' + event.name + ' updated.', life: 5000 });
				}
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}
			this.showEventDialog = false;
			this.isEditing = false;
			this.editingEvent = null;
		}
	}
};
</script>

<style scoped>

</style>
