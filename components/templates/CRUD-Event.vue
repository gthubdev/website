<template>
<Dialog :header="headline" :visible.sync="showEventDialog" :modal="true">
	<!--<div class="p-grid">-->
	<div class="p-grid p-align-baseline">
		<div class="p-col-6">
			<span class="p-float-label">
				<InputText id="name" v-model="event.name" type="text" class="full-width" />
				<label for="name">Name of the Event</label>
			</span>
		</div>


		<!--<div class="field-separator" />-->

		<div class="p-col-6 p-field">
			<Calendar
				v-model="chosenDates"
				:locale="locale_en"
				date-format="dd M yy"
				selection-mode="range"
				:show-icon="true"
				:select-other-months="true"
				:manual-input="false"
				:show-button-bar="false"
				:month-navigator="false"
				:year-navigator="false"
				year-range="2020:2021"
				:inline="false"
			/>
		</div>

		<!--<br />-->

		<div class="p-col-6 p-field">
			<AutoComplete v-model="chosenTrack" :suggestions="availableTracks" :dropdown="true" placeholder="Track" class="full-width" field="name" @complete="searchTrack($event)">
				<template #item="slotProps" class="full-width">
					<div class="p-clearfix">
						{{ slotProps.item.name }}
					</div>
				</template>
			</AutoComplete>
		</div>


		<!--<div class="field-separator" />-->

		<div class="p-col-6 p-field">
			<AutoComplete v-model="chosenMainSeries" :suggestions="availableMainSeries" :dropdown="true" placeholder="Main Series" class="full-width" field="name" @complete="searchMainSeries($event)">
				<template #item="slotProps" class="full-width">
					<div class="p-clearfix">
						{{ slotProps.item.name }}
					</div>
				</template>
			</AutoComplete>
		</div>


		<!--<div class="field-separator" />-->

		<div class="p-col-6 p-field">
			<Dropdown
				v-model="event.priority"
				:options="availablePriorities"
				option-label="name"
				option-value="value"
				placeholder="Select a priority"
			/>
		</div>

		<!--<div class="field-separator" />-->

		<div class="p-col-6 p-field">
			<span class="p-float-label">
				<InputText id="logo" v-model="event.logo" type="text" class="full-width" />
				<label for="name">Logo of the Event</label>
			</span>
		</div>
	</div>
	<!--<div class="p-col-6 p-align-baseline">
			<span class="sessions-headline">Sessions</span>
			<ul v-if="event.EventSessions && event.EventSessions.length">
				<li v-for="key in event.EventSessions" :key="key.id">
					{{ key.name }} ({{ key.Series.shortname }})
				</li>
			</ul>
		</div>-->
	<!--</div>-->

	<br />

	<div class="p-grid p-align-center">
		<div class="p-col-2">
			Support series:
		</div>
		<div class="p-col-10">
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
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-if="validInput()" :label="action" icon="pi pi-check" @click="sendRequest" />
	</template>
</Dialog>
</template>

<script>
import moment from 'moment';
import { constants, strings } from '~/plugins/constants';

export default {
	props: {
		showDialog: {
			type: Boolean, default: false
		},
		activeEvent: {
			type: Object, default: null
		},
		headline: {
			type: String, default: ''
		},
		action: {
			type: String, default: ''
		},
		updateMode: {
			type: Boolean, default: false
		},
		series: {
			type: Array, default() { return [];	}
		},
		tracks: {
			type: Array, default() { return []; }
		}
	},
	data: function() {
		return {
			showEventDialog: false,
			event: {
				name: '',
				track: '',
				mainseries: '',
				supportseries: [],
				startdate: '',
				enddate: '',
				logo: '',
				priority: ''
			},
			chosenTrack: '',
			availableTracks: [],
			chosenMainSeries: '',
			availableMainSeries: [],
			availablePriorities: [],
			// must be a 2-dimensional array
			pickListData:[[], []],
			chosenDates: [],
			PRIORITY_MAX: constants.PRIORITY_MAX,
			locale_en: {
				firstDayOfWeek: 1,
				dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
				dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
				dayNamesMin: ['Su','Mo','Tu','We','Th','Fr','Sa'],
				monthNames: [ 'January','February','March','April','May','June','July','August','September','October','November','December' ],
				monthNamesShort: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ],
				today: 'Today',
				clear: 'Clear',
				dateFormat: 'dd M yy',
				weekHeader: 'Wk'
			}
		};
	},
	watch: {
		showDialog(newValue) {
			this.showEventDialog = newValue;
		},
		showEventDialog(newValue) {
			if (newValue === false)
				this.$root.$emit(strings.CLOSED_CRUD_EVENT);

			this.chosenTrack = '';
			this.chosenMainSeries = '';
			this.chosenDates = [];

			if (newValue === true && this.updateMode === false) {
				this.pickListData = [this.series, []];
				// sort it alphabetically
				this.sourceListChanged();
			}

			if (newValue === true && this.updateMode === true && this.activeEvent !== undefined) {
				// Might need to reset the object
				this.resetActiveEvent();
			}

		},
		event(newValue) {
			console.log('NEW VALUE EVENT:', newValue);
		},
		activeEvent(newValue) {
			if (newValue === undefined) return;

			this.event = newValue;

			if (typeof newValue === 'object' && this.updateMode === true)
				this.resetActiveEvent();
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

			// this.event.priority = newValue.priority;

			// remove new main series from pickList
			let index = this.pickListData[0].findIndex(s => s.id === newValue.id);
			if (index >= 0)
				this.pickListData[0].splice(index, 1);

			index = this.pickListData[1].findIndex(s => s.id === newValue.id);
			if (index >= 0)
				this.pickListData[1].splice(index, 1);

			// add old main series as available support series
			if (typeof oldValue !== 'object') return;

			this.pickListData[0].push(oldValue);
			this.sourceListChanged();
		}
	},
	created() {
		for (let i = 1; i <= this.PRIORITY_MAX; i++)
			this.availablePriorities.push(
				{
					'value': i,
					'name': 'Priority ' + i
				});
	},
	methods: {
		close() {
			this.showEventDialog = false;
		},
		sendRequest() {
			this.event.track = this.chosenTrack.id;
			this.event.mainseries = this.chosenMainSeries.id;
			this.event.startdate = moment(this.chosenDates[0]).format('YYYY-MM-DD');
			this.event.enddate = moment(this.chosenDates[1]).format('YYYY-MM-DD');
			// set the support series
			this.event.supportseries = this.pickListData[1];

			// console.log('SENDING REQUEST CRUD EVENT');
			// console.log('Event:', JSON.stringify(this.event));
			this.$parent.$emit(strings.SEND_REQUEST_CRUD_EVENT, this.event);

		},
		validInput() {
			return this.validName() &&
				this.validTrack() &&
				this.validMainSeries() &&
				this.validPriority() &&
				this.validDates() &&
				this.validLogo();
		},
		validName() {
			return this.event !== undefined && this.event.name.length > 0;
		},
		validTrack() {
			return this.chosenTrack !== '' && this.chosenTrack.name;
		},
		validMainSeries() {
			return this.chosenMainSeries !== '' && this.chosenMainSeries.name;
		},
		validPriority() {
			return !isNaN(Number(this.event.priority)) && Number(this.event.priority) >= 1 && Number(this.event.priority) <= this.PRIORITY_MAX;
		},
		validDates() {
			return this.chosenDates !== undefined &&
				this.chosenDates.length > 1 &&
				moment(this.chosenDates[0]).isValid() &&
				moment(this.chosenDates[1]).isValid();
		},
		validLogo() {
			return this.event.logo.trim() === '' || this.event.logo.startsWith('https://') || this.event.logo.startsWith('http://');
		},
		findSeries(id) {
			let obj = this.series.find(s => s.id === id);
			return obj.shortname;
		},
		searchTrack(event) {
			if (event.query.trim() === '')
				this.availableTracks = [...this.tracks];
			else
				this.availableTracks = this.tracks.filter(track => {
					return track.name.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		searchMainSeries(event) {
			if (event.query.trim() === '')
				this.availableMainSeries = [...this.series];
			else
				this.availableMainSeries = this.series.filter(s => {
					return s.name.toLowerCase().includes(event.query.toLowerCase());
				});
		},
		sourceListChanged() {
			this.pickListData[0].sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
		},
		targetListChanged() {
			this.pickListData[1].sort((a,b) => {
				return a.name.localeCompare(b.name);
			});
		},
		resetActiveEvent() {
			this.event = JSON.parse(JSON.stringify(this.activeEvent));
			this.chosenTrack = this.event.Track;
			this.chosenMainSeries = this.event.Series;
			this.chosenDates[0] = new Date(this.event.startdate);
			this.chosenDates[1] = new Date(this.event.enddate);

			// set the picklist for the support series
			let support_arr = [];
			this.activeEvent.SupportSeries.forEach(ss => support_arr.push(ss.Series.id));

			this.pickListData = [[], []];
			this.series.forEach(s => {
				if (s.id === this.activeEvent.mainseries) return;

				if (support_arr.includes(s.id))
					this.pickListData[1].push(s);
				else
					this.pickListData[0].push(s);
			});
			this.sourceListChanged();
			this.targetListChanged();
		}
	}
};
</script>

<style lang="scss">
.p-dialog-content {
	padding: 2em 2em !important;
}
.p-dropdown, .p-multiselect {
	min-width: 100%;
}
.p-dropdown-item, .p-multiselect-item {
	min-width: 100%;
}
.field-separator {
	height: 2em;
}
.p-calendar {
	width: 100%;
}
.sessions-headline {
	font-size: 1.2em;
	font-weight: bold;
	padding-left: 0.5em;
}
ul {
	margin-block-start: 0.5em;
	margin-block-end: 0.5em;
}
li {
	line-height: 1.5em;
}
</style>
