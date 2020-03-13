<template>
<!--<div>
	<md-dialog :md-active.sync="showEventDialog">
		<md-dialog-content>

			<md-autocomplete v-model="event.track" md-dense :md-options="tracks.map(x=>({
				'id':x.id,
				'name':x.name,
				'toLowerCase':()=>x.name.toLowerCase(),
				'toString':()=>x.name
			}))" :class="requiredTrack"
			>
				<label>Track</label>
				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<span class="color" :style="`background-color: ${item.color}`" />
					<md-highlight-text :md-term="term.name ? term.name : term">
						{{ item.name }}
					</md-highlight-text>
				</template>

				<template slot="md-autocomplete-empty" slot-scope="{ term }">
					"{{ term }}" not found!
				</template>

				<span class="md-error">Please choose a track</span>
			</md-autocomplete>

			<md-autocomplete v-model="event.mainseries" md-dense :md-options="series.map(x=>({
				'id':x.id,
				'name':x.name,
				'toLowerCase':()=>x.name.toLowerCase(),
				'toString':()=>x.name
			}))" :class="requiredSeries"
			>
				<label>Main Series</label>
				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<span class="color" :style="`background-color: ${item.color}`" />
					<md-highlight-text :md-term="term.name ? term.name : term">
						{{ item.name }}
					</md-highlight-text>
				</template>

				<template slot="md-autocomplete-empty" slot-scope="{ term }">
					"{{ term }}" not found!
				</template>

				<span class="md-error">Please choose a main series</span>
			</md-autocomplete>

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

			<div class="md-layout">
				<div class="md-layout-item md-size-45">
					<label>Startdate</label>
					<VueCtkDateTimePicker
						v-model="event.startdate"
						:label="dateLabel()"
						format="YYYY-MM-DD"
						formatted="ddd, Do MMMM YYYY"
						:hint="dateHint()"
						:error="isInvalidDate()"
						color="#ed6400"
						button-color="#ed6400"
						:only-date="true"
						:auto-close="true"
						locale="en"
						:first-day-of-week="1"
						:dark="true"
					/>
				</div>

				<div class="md-layout-item">
					&nbsp;
				</div>

				<div class="md-layout-item md-size-45">
					<label>Enddate</label>
					<VueCtkDateTimePicker
						v-model="event.enddate"
						:label="dateLabel()"
						format="YYYY-MM-DD"
						formatted="ddd, Do MMMM YYYY"
						:hint="dateHint()"
						:error="isInvalidDate()"
						color="#ed6400"
						button-color="#ed6400"
						:min-date="event.startdate"
						:only-date="true"
						:auto-close="true"
						locale="en"
						:first-day-of-week="1"
						:dark="true"
					/>
				</div>
			</div>

			<md-field :class="requiredPriority">
				<label for="priority">Priority</label>
				<md-select id="priority" v-model="event.priority" name="priority" placeholder="Priority" required>
					<md-option v-for="i in PRIORITY_MAX" :key="i" :value="i">
						{{ i }}
					</md-option>
				</md-select>
				<span class="md-error">Please choose a priority</span>
			</md-field>

			<md-field>
				<label>Logo</label>
				<md-input v-model="event.logo" />
			</md-field>

			<md-dialog-actions>
				<md-button class="md-primary md-accent" @click="showEventDialog = false">
					Cancel
				</md-button>
				<md-button class="md-raised md-primary" :disabled="!validInput()" @click="sendRequest()">
					{{ action }}
				</md-button>
			</md-dialog-actions>
		</md-dialog-content>
	</md-dialog>
</div>-->
<Dialog :header="headline" :visible.sync="showEventDialog" :modal="true">
	<div>
		<span class="p-float-label">
			<InputText id="name" v-model="event.name" type="text" class="full-width" />
			<label for="name">Name of the Event</label>
		</span>
		<!-- track, main series, support series, start, end, priority, logo -->
	</div>
	<template #footer>
		<Button label="Cancel" icon="pi pi-times" class="p-button-secondary" @click="close" />
		<Button v-if="!validInput()" :label="action" icon="pi pi-check" disabled />
		<Button v-if="validInput()" :label="action" icon="pi pi-check" />
	</template>
</Dialog>
</template>

<script>
//import moment from 'moment';
import { constants, strings } from '~/plugins/constants';
//import { constants } from '~/plugins/constants';

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
			// chosenSupportSeries: '',
			// supportseries: [],
			// tmpSupportSeries: [],
			// validss: false,
			// initMainSet: false,
			chosenPriority: '',
			availablePriorities: [],
			PRIORITY_MAX: constants.PRIORITY_MAX
		};
	},
	computed: {
		// requiredEnddate() {
		// 	return {
		// 		'md-invalid': this.event.enddate === null || this.event.enddate === ''
		// 	};
		// },
		// requiredPriority() {
		// 	return {
		// 		'md-invalid': this.event.priority === undefined || this.event.priority === ''
		// 	};
		// },
		// requiredSeries() {
		// 	return {
		// 		'md-invalid': this.event.mainseries === undefined || !this.event.mainseries.id
		// 	};
		// },
		// requiredStartdate() {
		// 	return {
		// 		'md-invalid': this.event.startdate === null || this.event.startdate === ''
		// 	};
		// },
		// requiredTrack() {
		// 	return {
		// 		'md-invalid': this.event.track === undefined || !this.event.track.id
		// 	};
		// },
	},
	watch: {
		showDialog(newValue) {
			this.showEventDialog = newValue;
		},
		showEventDialog(newValue) {
			if (newValue === false)
				this.$root.$emit(strings.CLOSED_CRUD_EVENT);

		}
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
		// 'event.mainseries'(newValue, oldValue) {
		// 	// if a main series is removed as main series, add it to the list of possible support series
		// 	if (typeof newValue !== 'object') {
		// 		if (oldValue.id && this.tmpSupportSeries.findIndex(ss => ss.id == oldValue.id) < 0)
		// 			this.tmpSupportSeries.push(oldValue);
		// 		this.event.priority = '';
		// 		return;
		// 	}
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
	methods: {
		close() {
			this.showEventDialog = false;
		},
		validInput() {
			return this.validName();
		},
		validName() {
			return this.event !== undefined && this.event.name.length > 0;
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
		// headline() {
		// 	switch(this.mode) {
		// 		case 'create':
		// 			return 'Create an Event';
		// 		case 'update':
		// 			return 'Update ' + this.event.name;
		// 		default:
		// 			return '';
		// 	}
		// },
		// removeSupportSeries(series, index) {
		// 	this.supportseries.splice(index, 1);
		// 	this.tmpSupportSeries.push(series);
		// },
		// validInput() {
		// 	return this.event.name.length > 0 &&
		// 	this.event.track !== undefined && this.event.track.id &&
		// 	this.event.mainseries !== undefined && this.event.mainseries.id &&
		// 	!this.isInvalidDate() &&
		// 	this.event.priority >= 1;
		// },
		// isInvalidDate() {
		// 	if (this.event.startdate === null ||
		// 		this.event.startdate === '' ||
		// 		this.event.enddate === null ||
		// 		this.event.enddate === '')
		// 		return true;
		//
		// 	return moment(this.event.enddate).isBefore(moment(this.event.startdate).format('YYYY-MM-DD'));
		// },
		// dateLabel() {
		// 	return this.isInvalidDate() ? 'Select date' : '';
		// },
		// dateHint() {
		// 	return this.isInvalidDate() ? 'Please select valid dates' : '';
		// }
	}
};
</script>

<style lang="scss">
/*.md-dialog {
	min-width: 50%;
}
.md-menu-content {
	z-index: 100;
}*/
</style>
