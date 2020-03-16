<template>
<!--<div>
	<md-dialog :md-active.sync="showEventDialog">
		<md-dialog-content>
			<div v-if="event.mainseries !== undefined && event.mainseries.id && supportseries.length">
				<md-chip v-for="(ss, index) in supportseries" :key="ss.id" class="md-primary" md-deletable @md-delete="removeSupportSeries(ss, index)">
					{{ ss.name }}
				</md-chip>
			</div>

			<md-autocomplete v-if="event.mainseries !== undefined && event.mainseries.id" v-model="chosenSupportSeries" :md-options="tmpSupportSeries.map(x=>({
				'id':x.id,
				'name':x.name,
				'toLowerCase':()=>x.name.toLowerCase(),
				'toString':()=>x.name
			}))" :class="requiredSeries" :md-fuzzy-search="false"
			>
				<label>Support Series</label>
				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<span class="color" :style="`background-color: ${item.color}`" />
					<md-highlight-text :md-term="typeof term === 'object' && term.name ? term.name : term.toString()">
						{{ item.name }}
					</md-highlight-text>
				</template>

				<template slot="md-autocomplete-empty" slot-scope="{ term }">
					"{{ term }}" not found!
				</template>

				<span class="md-error">Please choose a main series</span>
			</md-autocomplete>

			</div>
		</md-dialog-content>
	</md-dialog>
</div>-->
<Dialog :header="headline" :visible.sync="showEventDialog" :modal="true">
	<!-- name, track, main series, support series, start, end, priority, logo -->
	<div>
		<span class="p-float-label">
			<InputText id="name" v-model="event.name" type="text" class="full-width" />
			<label for="name">Name of the Event</label>
		</span>
	</div>

	<br />

	<div>
		<AutoComplete v-model="chosenTrack" :suggestions="availableTracks" :dropdown="true" placeholder="Track" class="full-width" field="name" @complete="searchTrack($event)">
			<template #item="slotProps" class="full-width">
				<div class="p-clearfix">
					{{ slotProps.item.name }}
				</div>
			</template>
		</AutoComplete>
	</div>

	<br />

	<div>
		<AutoComplete v-model="chosenMainSeries" :suggestions="availableMainSeries" :dropdown="true" placeholder="Main Series" class="full-width" field="name" @complete="searchMainSeries($event)">
			<template #item="slotProps" class="full-width">
				<div class="p-clearfix">
					{{ slotProps.item.name }}
				</div>
			</template>
		</AutoComplete>
	</div>

	<br />

	<div class="p-grid p-align-center">
		<div class="p-col-4">
			Support series:
		</div>
		<div class="p-col-8">
			<MultiSelect
				v-model="chosenSupportSeries"
				:options="availableSupportSeries"
				option-label="name"
				option-value="id"
				placeholder="Select support series"
				:filter="true"
			>
				<template #value="slotProps">
					<div v-for="option of slotProps.value" :key="option.id" class="p-multiselect-ss-token">
						<span>{{ findSeries(option) }}</span>
					</div>
					<div v-if="!slotProps.value || slotProps.value.length === 0">
						Select Support Series
					</div>
				</template>
				<template #option="slotProps">
					<div class="p-multiselect-ss-option">
						<span>
							{{ slotProps.option.name }}
						</span>
					</div>
				</template>
			</MultiSelect>
		</div>
	</div>

	<div class="p-grid p-align-center">
		<div class="p-col-4">
			Priority:
		</div>
		<div class="p-col-8">
			<Dropdown v-model="chosenPriority" :options="availablePriorities" option-label="name" placeholder="Select a priority" />
		</div>
	</div>

	<div class="p-fluid">
		<Calendar
			v-model="chosenDates"
			selection-mode="range"
			:manual-input="false"
			:show-button-bar="false"
			:month-navigator="true"
			:year-navigator="true"
			year-range="2020:2021"
			:inline="true"
		/>
	</div>

	<br />

	<div>
		<span class="p-float-label">
			<InputText id="logo" v-model="event.logo" type="text" class="full-width" />
			<label for="name">Logo of the Event</label>
		</span>
	</div>

	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-if="validInput()" :label="action" icon="pi pi-check" />
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
				startdate: '',
				enddate: '',
				logo: '',
				priority: ''
			},
			chosenTrack: '',
			availableTracks: [],
			chosenMainSeries: '',
			availableMainSeries: [],
			chosenSupportSeries: [],
			availableSupportSeries: [],
			chosenPriority: '',
			availablePriorities: [],
			chosenDates: [],
			PRIORITY_MAX: constants.PRIORITY_MAX
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
			this.chosenSupportSeries = [];
			this.chosenPriority = '';
			this.chosenDates = [];
		},
		activeEvent(newValue) {
			if (newValue === undefined) return;

			this.event = newValue;
		},
		// showEventDialog(newValue, oldValue) {
		// 	if (oldValue === true)
		// 		this.$root.$emit(strings.TOGGLE_CRUD_EVENT);
		// 	if (newValue === true && this.mode === 'create') {
		// 		Object.keys(this.event).forEach(key => (this.event[key] = ''));
		// 		this.initMainSet = true;
		// 		// Reset arrays
		// 		this.supportseries.splice(0);
		// 		this.tmpSupportSeries.splice(0);
		// 		this.tmpSupportSeries = Array.from(this.series);
		// 		this.chosenSupportSeries = {
		// 			'id':'',
		// 			'name': '',
		// 			'toLowerCase':()=>'',
		// 			'toString':()=>''
		// 		};
		// 	}
		// 	if (newValue === true && this.mode === 'update' && this.activeEvent !== undefined) {
		// 		this.initMainSet = false;
		// 		this.event = JSON.parse(JSON.stringify(this.activeEvent));
		// 		let track = this.tracks.find(t => t.id == this.event.track);
		// 		this.event.track = {
		// 			'id': track.id,
		// 			'name': track.name,
		// 			'toLowerCase':()=>track.name.toLowerCase(),
		// 			'toString':()=>track.name
		// 		};
		// 		let mainseries = this.series.find(s => s.id == this.event.mainseries);
		// 		this.event.mainseries = {
		// 			'id': mainseries.id,
		// 			'name': mainseries.name,
		// 			'toLowerCase':()=>mainseries.name.toLowerCase(),
		// 			'toString':()=>mainseries.name
		// 		};
		// 		// Reset arrays
		// 		this.supportseries.splice(0);
		// 		this.tmpSupportSeries.splice(0);
		// 		this.tmpSupportSeries = Array.from(this.series);
		// 		// Move all support series to corresponding array
		// 		this.activeEvent.SupportSeries.forEach(s => {
		// 			let index = this.tmpSupportSeries.findIndex(ss => ss.id == s.series);
		// 			this.supportseries.push(this.tmpSupportSeries[index]);
		// 			this.tmpSupportSeries.splice(index, 1);
		// 		});
		// 	}
		// },
		chosenMainSeries(newValue) {
			if (typeof newValue !== 'object') return;

			this.chosenPriority =
				{
					'value': newValue.priority,
					'name': 'Priority ' + newValue.priority
				};
		}
			// // if a main series is removed as main series, add it to the list of possible support series
			// if (typeof newValue !== 'object') {
			// 	if (oldValue.id && this.tmpSupportSeries.findIndex(ss => ss.id == oldValue.id) < 0)
			// 		this.tmpSupportSeries.push(oldValue);
			// 	this.event.priority = '';
			// 	return;
			// }
		// 	// if a series is now the main series, remove it as an option for a support series
		// 	let index = this.tmpSupportSeries.findIndex(ss => ss.id == newValue.id);
		// 	if (index >= 0) {
		// 		this.tmpSupportSeries.splice(index, 1);
		// 	}
		// 	// if a series is now the main series, remove it as support series if it had been one
		// 	index = this.supportseries.findIndex(ss => ss.id == newValue.id);
		// 	if (index >= 0) {
		// 		this.supportseries.splice(index, 1);
		// 	}
		// 	// set priority for event
		// 	// somewhat dirty hack, because this function will override the initial value set when editing an event
		// 	// cannot guarantee the order since this is a watch-function
		// 	// must therefore use an indicator to not override the value
		// 	if (this.initMainSet == true) {
		// 		let series = this.series.find(s => s.id == newValue.id);
		// 		this.event.priority = series.priority;
		// 	} else {
		// 		this.initMainSet = true;
		// 	}
		// },
		// chosenSupportSeries(newValue) {
		// 	if (newValue !== undefined && newValue.name && newValue.name.length) {
		// 		this.series.forEach(s => {
		// 			if (s.name === newValue.name) {
		// 				this.supportseries.push(newValue);
		// 				let index = this.tmpSupportSeries.findIndex(ss => ss.id == newValue.id);
		// 				this.tmpSupportSeries.splice(index, 1);
		// 				this.chosenSupportSeries = {
		// 					'id':'',
		// 					'name': '',
		// 					'toLowerCase':()=>'',
		// 					'toString':()=>''
		// 				};
		// 			}
		// 		});
		// 	}
		// }
	},
	created() {
		this.availableSupportSeries = this.series;
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
			return !isNaN(Number(this.chosenPriority.value)) && Number(this.chosenPriority.value) >= 1 && Number(this.chosenPriority.value) <= this.PRIORITY_MAX;
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
		}
		// async sendRequest() {
		// 	const event = JSON.parse(JSON.stringify(this.event));
		// 	event.track = event.track.id;
		// 	event.mainseries = event.mainseries.id;
		// 	event.supportseries = this.supportseries;
		//
		// 	if (this.mode === 'create') {
		// 		try {
		// 			const res = await this.$axios.$post('/api/calendar/event/create', {
		// 				event
		// 			});
		// 			this.$root.$emit(strings.EVENT_CREATED, res);
		// 		} catch(err) {
		// 			if (err.response)
		// 				alert(err.response);
		// 		}
		// 	} else if (this.mode === 'update') {
		// 		delete event.createdAt;
		// 		try {
		// 			const res = await this.$axios.$post('/api/calendar/event/update/' + event.id, {
		// 				event
		// 			});
		// 			if (res.id && res.id >= 1)
		// 				this.$root.$emit(strings.EVENT_UPDATED, res);
		// 		} catch(err) {
		// 			if (err.response)
		// 				alert(err.response);
		// 		}
		// 	}
		// 	this.showEventDialog = false;
		// },
		// removeSupportSeries(series, index) {
		// 	this.supportseries.splice(index, 1);
		// 	this.tmpSupportSeries.push(series);
		// },
	}
};
</script>

<style lang="scss">
.p-dropdown, .p-multiselect {
	min-width: 100%;
}
.p-dropdown-item, .p-multiselect-item {
	min-width: 100%;
}
.p-autocomplete-input {
	min-width: 90% !important;
}
.p-autocomplete {
	width: 100% !important;
}
.p-multiselect-ss-option {
	display: inline-block;
	vertical-align: middle;
}
.p-multiselect-ss-token {
	background: #FFB300;
	color: #000;
	padding: 2px 5px;
	margin: 0 0.5em 0.4em 0;
	display: inline-block;
	vertical-align: middle;
	height: 1.8em;
	border-radius: 5px;
}
</style>
