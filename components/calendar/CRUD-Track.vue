<template>
<div>
	<md-dialog :md-active.sync="showTrackDialog">
		<md-dialog-title>Create a Track</md-dialog-title>

		<md-field :class="requiredName">
			<label>Name</label>
			<md-input v-model="track.name" required />
			<span class="md-error">Please enter a name</span>
		</md-field>

		<md-field>
			<label>Location</label>
			<md-input v-model="track.location" />
		</md-field>

		<md-autocomplete v-model="track.timezone" md-dense :md-options="tz.tz_array.map(x=>({
			'name':x.name,
			'desc': x.desc,
			'toLowerCase':()=>x.desc.toLowerCase(),
			'toString':()=>x.desc
		}))" :class="requiredTimezone"
		>
			<label>Timezone</label>

			<template slot="md-autocomplete-item" slot-scope="{ item }">
				<!-- <span class="color" :style="`background-color: ${item.color}`"></span> -->
				<!-- <md-highlight-text :md-term="tzDisplay(item)">{{ tzDisplay(item) }}</md-highlight-text> -->
				{{ tzDisplay(item) }}
			</template>

			<template slot="md-autocomplete-empty" slot-scope="{ term }">
				"{{ term }}" not found!
			</template>

			<span class="md-error">Please choose a timezone</span>
		</md-autocomplete>

		<md-field :class="requiredLength">
			<label>Length</label>
			<md-input v-model="track.length" required />
			<span class="md-error">Please enter a valid length</span>
		</md-field>

		<md-field>
			<label>Map</label>
			<md-input v-model="track.map" />
		</md-field>

		<md-dialog-actions>
			<md-button class="md-primary md-accent" @click="showTrackDialog = false">
				Cancel
			</md-button>
			<md-button class="md-raised md-primary" :disabled="!validInput()" @click="sendRequest()">
				Create
			</md-button>
		</md-dialog-actions>
	</md-dialog>
</div>
</template>

<script>
import moment from 'moment-timezone';

export default {
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		tz: {
			type: Object,
			default: null
		}
	},
	data: function() {
		return {
			showTrackDialog: false,
			track: {
				name: '',
				location: '',
				timezone: '',
				length: '',
				map: ''
			}
		};
	},
	computed: {
		requiredName() {
			return {
				'md-invalid': !(this.track.name.length > 0)
			};
		},
		requiredLength() {
			return {
				'md-invalid': isNaN(Number(this.track.length)) || Number(this.track.length) <= 0
			};
		},
		requiredTimezone() {
			return {
				'md-invalid': this.track.timezone === undefined || this.track.timezone.length <= 0
			};
		}
	},
	watch: {
		showDialog: function(newValue) {
			this.showTrackDialog = newValue;
		},
		showTrackDialog: function(newValue, oldValue) {
			if (oldValue === true)
			this.$root.$emit('toggleCrudTrack');
			if (newValue === true)
			Object.keys(this.track).forEach(key => (this.track[key] = ''));
		}
	},
	methods: {
		async sendRequest() {
			const track = JSON.parse(JSON.stringify(this.track));
			track.timezone = track.timezone.name;
			this.showTrackDialog = false;
			const res = await this.$axios.$post('/api/calendar/track/create', {
				track
			});
			this.$root.$emit('trackCreated', res);
		},
		validInput: function() {
			return this.track.name.length > 0 &&
				this.track.timezone.name !== undefined &&
				!isNaN(Number(this.track.length)) &&
				Number(this.track.length) > 0;
		},
		tzDisplay: function(item) {
			return '(UTC' + moment.tz(item.name).format('Z') + ') ' + item.desc;
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
</style>
