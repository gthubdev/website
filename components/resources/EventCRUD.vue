<template>
<Dialog :header="headline" :visible.sync="showEventDialog" :modal="true">
	<div class="pt-2">
		<span class="p-float-label">
			<InputText id="name" v-model="event.name" type="text" class="full-width" />
			<label for="name">Event Name</label>
		</span>
	</div>

	<div class="pt-2">
		<Calendar
			v-model="chosenDates"
			date-format="dd M yy"
			selection-mode="range"
			:show-icon="true"
			:select-other-months="true"
			:manual-input="false"
			:show-button-bar="false"
			:month-navigator="false"
			:year-navigator="false"
			year-range="2021:2022"
			:inline="false"
		/>
	</div>

	<div class="flex flex-row">
		<div class="pt-2 flex-grow">
			<Dropdown
				v-model="event.priority"
				:options="availablePriorities"
				option-label="name"
				option-value="value"
				placeholder="Select a priority"
			/>
		</div>

		<div class="pt-2">
			<span class="p-float-label">
				<InputText id="logo" v-model="event.logo" type="text" class="full-width" />
				<label for="name">Logo of the Event</label>
			</span>
		</div>
	</div>

	<div class="pt-2">
		<AutoComplete
			v-model="chosenTrack"
			:suggestions="availableTracks"
			:dropdown="true"
			field="name"
			placeholder="Track"
			force-selection
			@complete="searchTrack($event)"
		>
			<template #item="slotProps">
				{{ getCountryFlag(slotProps.item.country) }}
				{{ slotProps.item.name }}
			</template>
		</AutoComplete>
	</div>

	<div class="pt-2">
		<AutoComplete
			v-model="chosenMainSeries"
			:suggestions="availableMainSeries"
			:dropdown="true"
			field="name"
			placeholder="MainSeries"
			force-selection
			@complete="searchMainSeries($event)"
		>
			<template #item="slotProps">
				{{ slotProps.item.name }}
			</template>
		</AutoComplete>
	</div>

	<div class="pt-2">
		<PickList
			v-model="pickListData"
			data-key="id"
			@move-to-source="sourceListChanged()"
			@move-all-to-source="sourceListChanged()"
			@move-to-target="targetListChanged()"
			@move-all-to-target="targetListChanged()"
		>
			<template #sourceHeader>
				Available
			</template>
			<template #targetHeader>
				Selected
			</template>
			<template #item="slotProps">
				<span>
					{{ slotProps.item.name }}
				</span>
			</template>
		</PickList>
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-else :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import AutoComplete from 'primevue/autocomplete';
import Calendar from 'primevue/calendar';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import PickList from 'primevue/picklist';
import { mapGetters } from 'vuex';
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	components: {
		AutoComplete, Calendar, Dialog, Dropdown, InputText, PickList
	},
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		isEditing: {
			type: Boolean, default: false
		},
		editingEvent: {
			type: Object, default: null
		}
	},
	data() {
		return {
			showEventDialog: false,
			action: '',
			headline: '',
			event: {
				name: '',
				priority: '',
				logo: '',
				track: '',
				startdate: '',
				enddate: '',
				mainseries_id: '',
				supportseries: []
			},
			availablePriorities: [],
			chosenMainSeries: '',
			availableMainSeries: [],
			chosenTrack: '',
			availableTracks: [],
			chosenDates: [],
			pickListData: [[], []]
		};
	},
	computed: {
		...mapGetters({
			allSeries: 'resources/series/get',
			allTracks: 'resources/tracks/get'
		})
	},
	watch: {
		showDialog(newValue) {
			this.showEventDialog = newValue;
		},
		showEventDialog(newValue) {
			if (newValue === false)
				this.$emit('event-crud-closed');

			if (newValue === true && this.isEditing === false) {
				this.action = 'Create';
				this.headline = 'Create an event';
				this.event = {
					name: '',
					priority: '',
					logo: '',
					track: '',
					startdate: '',
					enddate: '',
					mainseries_id: '',
					supportseries: []
				};
				this.chosenTrack = '';
				this.chosenMainSeries = '';
				this.chosenDates = [];
				this.pickListData = [[...this.allSeries], []];
			}

			if (newValue === true && this.isEditing === true) {
				this.action = 'Update';
				this.headline = 'Update ' + this.editingEvent.name;
				this.event = {
					name: this.editingEvent.name,
					priority: this.editingEvent.priority,
					logo: this.editingEvent.logo,
					track: '',
					startdate: '',
					enddate: '',
					mainseries_id: '',
					supportseries: []
				};
				this.chosenTrack = this.editingEvent.Track;
				this.chosenMainSeries = this.editingEvent.Series;
				this.chosenDates[0] = new Date(this.editingEvent.startdate);
				this.chosenDates[1] = new Date(this.editingEvent.enddate);

				// set the picklist for the support series
				const support_arr = [];
				this.editingEvent.SupportSeries.forEach(s => support_arr.push(s.Series.id));

				const available = [];
				const selected = [];
				this.allSeries.forEach(s => {
					if (s.id === this.editingEvent.id)
						return;

					if (support_arr.includes(s.id))
						selected.push(s);
					else
						available.push(s);
				});
				this.pickListData[0].length = 0;
				this.pickListData[1].length = 0;
				this.pickListData = [[...available], [...selected]];
				this.sourceListChanged();
				this.targetListChanged();
			}
		},
		chosenMainSeries(newValue, oldValue) {
			if (typeof newValue !== 'object') {
				this.event.priority = '';
				// add old main series to list of available support series
				if (typeof oldValue === 'object') {
					this.pickListData[0].push(oldValue);
					this.sourceListChanged();
				}
				return;
			}

			// remove new main series from both picklists
			let index = this.pickListData[0].findIndex(s => s.id === newValue.id);
			if (index >= 0)
				this.pickListData[0].splice(index, 1);

			index = this.pickListData[1].findIndex(s => s.id === newValue.id);
			if (index >= 0)
				this.pickListData[1].splice(index, 1);

			// add old main series as available support series
			if (typeof oldValue !== 'object')
				return;

			this.pickListData[0].push(oldValue);
			this.sourceListChanged();
		}
	},
	created() {
		for (let i = 1; i <= 4; i++)
			this.availablePriorities.push({ value: i, name: 'Priority ' + i });

		this.availableTracks = this.allTracks;
		this.availableMainSeries = this.allSeries;
		this.pickListData = [[...this.allSeries], []];
		this.showEventDialog = this.showDialog;
	},
	methods: {
		close() {
			this.showEventDialog = false;
		},
		sendRequest() {
			this.event.track_id = this.chosenTrack.id;
			this.event.mainseries_id = this.chosenMainSeries.id;
			this.event.supportseries = this.pickListData[1];
			this.event.startdate = this.$dayjs(this.chosenDates[0]).format('YYYY-MM-DD');
			this.event.enddate = this.$dayjs(this.chosenDates[1]).format('YYYY-MM-DD');
			this.$emit('send-request', this.event);
		},
		validInput() {
			return this.validName() &&
				this.validPriority() &&
				this.validTrack() &&
				this.validDates() &&
				this.validMainSeries() &&
				this.validLogo();
		},
		validName() {
			return this.event !== undefined && this.event.name.length > 0;
		},
		validPriority() {
			return !isNaN(Number(this.event.priority)) && Number(this.event.priority) >= 1 && Number(this.event.priority) <= 4;
		},
		validTrack() {
			return this.chosenTrack !== '' && this.chosenTrack !== null && this.chosenTrack.name;
		},
		validLogo() {
			return this.event.logo.trim() === '' || this.event.logo.startsWith('https://') || this.event.logo.startsWith('http://');
		},
		validDates() {
			return this.chosenDates !== undefined &&
				this.chosenDates.length > 1 &&
				this.$dayjs(this.chosenDates[0]).isValid() &&
				this.$dayjs(this.chosenDates[1]).isValid();
		},
		validMainSeries() {
			return this.chosenMainSeries !== '' && this.chosenMainSeries.name;
		},
		getCountryFlag(country) {
			return flag(cl.getCode(country));
		},
		searchTrack(event) {
			if (event.query.trim() === '')
				this.availableTracks = [...this.allTracks];
			else
				this.availableTracks = this.allTracks.filter(track => {
					return track.name.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		searchMainSeries(event) {
			if (event.query.trim() === '')
				this.availableMainSeries = [...this.allSeries];
			else
				this.availableMainSeries = this.allSeries.filter(series => {
					return series.name.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		sourceListChanged() {
			this.pickListData[0].sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		},
		targetListChanged() {
			this.pickListData[1].sort((a, b) => {
				return a.name.localeCompare(b.name);
			});
		}
	}
};
</script>

<style scoped>

</style>
