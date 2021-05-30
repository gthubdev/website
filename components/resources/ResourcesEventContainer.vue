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
						<div class="pl-6 pt-1">
							{{ eventDate(slotProps.data) }}
						</div>
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<EventCRUD
		:show-dialog="showEventDialog"
		@event-crud-closed="closeEventCrud"
		@send-request="sendRequest"
	/>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import { mapGetters, mapMutations } from 'vuex';
import EventCRUD from '~/components/resources/EventCRUD';

export default {
	components: {
		DataView, InputText, EventCRUD
	},
	data: function() {
		return {
			searchTerm: '',
			displayedEvents: [],
			showEventDialog: false
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
			addEvent: 'resources/events/add'
		}),
		openEventCrud() {
			this.showEventDialog = true;
		},
		closeEventCrud() {
			this.showEventDialog = false;
		},
		startdate(event) {
			return this.$dayjs(event.startdate).format('ddd Do MMM');
		},
		enddate(event) {
			return this.$dayjs(event.enddate).format('ddd Do MMM');
		},
		eventDate(event) {
			if (event.startdate === event.enddate)
				return this.startdate(event);
			else
				return this.startdate(event) + ' - ' + this.enddate(event);
		},
		async sendRequest(obj) {
			const event = JSON.parse(JSON.stringify(obj));
			delete event.createdAt;
			const url = '/api/calendar/event/create';

			try {
				const res = await this.$axios.$post(url, {
					event
				});
				this.addEvent(res);
				this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Event ' + event.name + ' created.', life: 5000 });
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}
			this.showEventDialog = false;
		}
	}
};
</script>

<style scoped>

</style>
