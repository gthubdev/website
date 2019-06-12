<template>
<div>
	<md-dialog :md-active.sync="showEventDialog">
		<md-dialog-title>Create an Event</md-dialog-title>

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
				<md-highlight-text :md-term="term">
					{{ item.name }}
				</md-highlight-text>
			</template>

			<template slot="md-autocomplete-empty" slot-scope="{ term }">
				"{{ term }}" not found!
			</template>

			<span class="md-error">Please choose a track</span>
		</md-autocomplete>

		<md-autocomplete v-model="event.series" :md-options="series.map(x=>({
			'id':x.id,
			'name':x.name,
			'toLowerCase':()=>x.name.toLowerCase(),
			'toString':()=>x.name
		}))" :class="requiredSeries"
		>
			<label>Main Series</label>
			<template slot="md-autocomplete-item" slot-scope="{ item, term }">
				<span class="color" :style="`background-color: ${item.color}`" />
				<md-highlight-text :md-term="term">
					{{ item.name }}
				</md-highlight-text>
			</template>

			<template slot="md-autocomplete-empty" slot-scope="{ term }">
				"{{ term }}" not found!
			</template>

			<span class="md-error">Please choose a main series</span>
		</md-autocomplete>

		<md-field v-if="event.series !== undefined && event.series !== ''">
			<label for="supportseries">Support series</label>
			<md-select id="supportseries" v-model="supportseries" name="supportseries" multiple>
				<md-option v-for="s in filterSupportSeries()" :key="s.id" :value="s.id">
					{{ s.name }}
				</md-option>
			</md-select>
		</md-field>

		<div class="md-layout">
			<div class="block md-layout-item">
				<label>Startdate</label>
				<md-datepicker v-model="event.startdate" md-immediately :class="requiredStartdate">
					<span class="md-error">Please choose a startdate</span>
				</md-datepicker>
			</div>

			<div class="block md-layout-item">
				<label>Enddate</label>
				<md-datepicker v-model="event.enddate" md-immediately :class="requiredEnddate">
					<span class="md-error">Please choose an enddate</span>
				</md-datepicker>
			</div>
		</div>

		<md-field :class="requiredPriority">
			<label for="priority">Priority (will be pre-filled from Series-priority in future)</label>
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
			<md-button class="md-raised md-primary" :disabled="!validInput()" @click="createEvent()">
				Create
			</md-button>
		</md-dialog-actions>
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
		}
	},
	data: function() {
		return {
			showEventDialog: false,
			event: {
				name: '',
				track: '',
				series: '',
				startdate: '',
				enddate: '',
				logo: ''
			},
			supportseries: []
		};
	},
	computed: {
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
				'md-invalid': !(this.event.priority >= 1)
			};
		},
		requiredSeries() {
			return {
				'md-invalid': this.event.series === undefined || this.event.series === ''
			};
		},
		requiredStartdate() {
			return {
				'md-invalid': this.event.startdate === null || this.event.startdate === ''
			};
		},
		requiredTrack() {
			return {
				'md-invalid': this.event.track === undefined || this.event.track === ''
			};
		},
	},
	watch: {
		showDialog: function(newValue) {
			this.showEventDialog = newValue;
		},
		showEventDialog: function(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudEvent');
			if (newValue === true) {
				Object.keys(this.event).forEach(key => (this.event[key] = ''));
				this.supportseries = [];
			}
		},
		'event.series': function(newValue) {
			// if a series was a support series and is now the main series, remove it as a support series
			if (isNaN(newValue.id))
				return;
			let index = this.supportseries.indexOf(newValue.id);
			if (index >= 0)
				this.supportseries.splice(index, 1);
		}
	},
	methods: {
		async createEvent() {
			const event = JSON.parse(JSON.stringify(this.event));
			event.track = event.track.id;
			event.mainseries = event.series.id;
			event.supportseries = this.supportseries;
			this.showEventDialog = false;
			const res = await this.$axios.$post('/api/calendar/event/create', {
				event
			});
			this.$root.$emit('eventCreated', res);
		},
		filterSupportSeries: function() {
			if (this.event.series === undefined || this.event.series === '')
			return this.series;
			else
			return this.series.filter(series => {
				return series.id !== this.event.series.id;
			});
		},
		validInput: function() {
			return this.event.name.length > 0 && this.event.track !== '' &&
			this.event.track !== undefined && this.event.track !== '' &&
			this.event.series !== undefined && this.event.series !== '' &&
			this.event.startdate !== null && this.event.startdate !== '' &&
			this.event.enddate !== null && this.event.enddate !== '' &&
			this.event.priority >= 1;
		}
	}
};
</script>

<style lang="scss">
.md-dialog {
	min-width: 33%;
}

.md-field {
	width: auto;
	margin-left: 1em;
	margin-right: 1em;
}

.md-menu-content {
	z-index: 100;
}

.block {
	padding-left: 1em;
}
</style>
