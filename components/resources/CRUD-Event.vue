<template>
<div>
	<md-dialog :md-active.sync="showEventDialog">
		<md-dialog-content>
			<md-dialog-title>{{ headline() }}</md-dialog-title>

			<md-field :class="requiredName">
				<label>Name</label>
				<md-input v-model="event.name" required />
				<span class="md-error">Please enter a name</span>
			</md-field>

			<md-autocomplete v-model="event.track" :md-options="tracks.map(x=>({
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

			<md-autocomplete v-model="event.mainseries" :md-options="series.map(x=>({
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
				<div class="md-layout-item">
					<label>Startdate</label>
					<VueCtkDateTimePicker
						v-model="event.startdate"
						format="YYYY-MM-DD"
						formatted="ddd, Do MMMM YYYY"
						:only-date="true"
						:auto-close="true"
						locale="en"
						:first-day-of-week="1"
						:dark="true"
					/>
				</div>

				<div class="md-layout-item">
					<label>Enddate</label>
					<VueCtkDateTimePicker
						v-model="event.enddate"
						format="YYYY-MM-DD"
						formatted="ddd, Do MMMM YYYY"
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
					<md-option v-for="i in 4" :key="i" :value="i">
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
</div>
</template>

<script>
export default {
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		activeEvent: {
			type: Object,
			default: null
		},
		series: {
			type: Array,
			default() {
				return [];
			}
		},
		tracks: {
			type: Array,
			default() {
				return [];
			}
		},
		mode: {
			type: String,
			default: ''
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
			chosenSupportSeries: '',
			supportseries: [],
			tmpSupportSeries: [],
			validss: false,
			initMainSet: false
		};
	},
	computed: {
		action() {
			switch(this.mode) {
				case 'create':
					return 'Create';
				case 'update':
					return 'Update';
				default:
					return '';
			}
		},
		requiredEnddate() {
			return {
				'md-invalid': this.event.enddate === null || this.event.enddate === ''
			};
		},
		requiredName() {
			return {
				'md-invalid': !(this.event.name.length > 0)
			};
		},
		requiredPriority() {
			return {
				'md-invalid': this.event.priority === undefined || this.event.priority === ''
			};
		},
		requiredSeries() {
			return {
				'md-invalid': this.event.mainseries === undefined || !this.event.mainseries.id
			};
		},
		requiredStartdate() {
			return {
				'md-invalid': this.event.startdate === null || this.event.startdate === ''
			};
		},
		requiredTrack() {
			return {
				'md-invalid': this.event.track === undefined || !this.event.track.id
			};
		},
	},
	watch: {
		showDialog(newValue) {
			this.showEventDialog = newValue;
		},
		showEventDialog(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudEvent');
			if (newValue === true && this.mode === 'create') {
				Object.keys(this.event).forEach(key => (this.event[key] = ''));
				this.initMainSet = true;
				// Reset arrays
				this.supportseries.splice(0);
				this.tmpSupportSeries.splice(0);
				this.tmpSupportSeries = Array.from(this.series);
				this.chosenSupportSeries = {
					'id':'',
					'name': '',
					'toLowerCase':()=>'',
					'toString':()=>''
				};
			}
			if (newValue === true && this.mode === 'update' && this.activeEvent !== undefined) {
				this.initMainSet = false;
				this.event = JSON.parse(JSON.stringify(this.activeEvent));
				let track = this.tracks.find(t => t.id == this.event.track);
				this.event.track = {
					'id': track.id,
					'name': track.name,
					'toLowerCase':()=>track.name.toLowerCase(),
					'toString':()=>track.name
				};
				let mainseries = this.series.find(s => s.id == this.event.mainseries);
				this.event.mainseries = {
					'id': mainseries.id,
					'name': mainseries.name,
					'toLowerCase':()=>mainseries.name.toLowerCase(),
					'toString':()=>mainseries.name
				};
				// Reset arrays
				this.supportseries.splice(0);
				this.tmpSupportSeries.splice(0);
				this.tmpSupportSeries = Array.from(this.series);
				// Move all support series to corresponding array
				this.activeEvent.SupportSeries.forEach(s => {
					let index = this.tmpSupportSeries.findIndex(ss => ss.id == s.series);
					this.supportseries.push(this.tmpSupportSeries[index]);
					this.tmpSupportSeries.splice(index, 1);
				});
			}
		},
		'event.mainseries'(newValue, oldValue) {
			// if a main series is removed as main series, add it to the list of possible support series
			if (typeof newValue !== 'object') {
				if (oldValue.id && this.tmpSupportSeries.findIndex(ss => ss.id == oldValue.id) < 0)
					this.tmpSupportSeries.push(oldValue);
				this.event.priority = '';
				return;
			}
			// if a series is now the main series, remove it as an option for a support series
			let index = this.tmpSupportSeries.findIndex(ss => ss.id == newValue.id);
			if (index >= 0) {
				this.tmpSupportSeries.splice(index, 1);
			}
			// if a series is now the main series, remove it as support series if it had been one
			index = this.supportseries.findIndex(ss => ss.id == newValue.id);
			if (index >= 0) {
				this.supportseries.splice(index, 1);
			}
			// set priority for event
			// somewhat dirty hack, because this function will override the initial value set when editing an event
			// cannot guarantee the order since this is a watch-function
			// must therefore use an indicator to not override the value
			if (this.initMainSet == true) {
				let series = this.series.find(s => s.id == newValue.id);
				this.event.priority = series.priority;
			} else {
				this.initMainSet = true;
			}
		},
		chosenSupportSeries(newValue) {
			if (newValue !== undefined && newValue.name && newValue.name.length) {
				this.series.forEach(s => {
					if (s.name === newValue.name) {
						this.supportseries.push(newValue);
						let index = this.tmpSupportSeries.findIndex(ss => ss.id == newValue.id);
						this.tmpSupportSeries.splice(index, 1);
						this.chosenSupportSeries = {
							'id':'',
							'name': '',
							'toLowerCase':()=>'',
							'toString':()=>''
						};
					}
				});
			}
		}
	},
	methods: {
		async sendRequest() {
			const event = JSON.parse(JSON.stringify(this.event));
			event.track = event.track.id;
			event.mainseries = event.mainseries.id;
			event.supportseries = this.supportseries;

			if (this.mode === 'create') {
				try {
					const res = await this.$axios.$post('/api/calendar/event/create', {
						event
					});
					this.$root.$emit('eventCreated', res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			} else if (this.mode === 'update') {
				delete event.createdAt;
				try {
					const res = await this.$axios.$post('/api/calendar/event/update/' + event.id, {
						event
					});
					if (res.id && res.id >= 1)
						this.$root.$emit('eventUpdated', res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			}
			this.showEventDialog = false;
		},
		headline() {
			switch(this.mode) {
				case 'create':
					return 'Create an Event';
				case 'update':
					return 'Update ' + this.event.name;
				default:
					return '';
			}
		},
		removeSupportSeries(series, index) {
			this.supportseries.splice(index, 1);
			this.tmpSupportSeries.push(series);
		},
		validInput() {
			return this.event.name.length > 0 &&
			this.event.track !== undefined && this.event.track.id &&
			this.event.mainseries !== undefined && this.event.mainseries.id &&
			this.event.startdate !== null && this.event.startdate !== '' &&
			this.event.enddate !== null && this.event.enddate !== '' &&
			this.event.priority >= 1;
		}
	}
};
</script>

<style lang="scss">
.md-dialog {
	min-width: 50%;
}
.md-menu-content {
	z-index: 100;
}
</style>
