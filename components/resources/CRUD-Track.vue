<template>
<div>
	<md-dialog :md-active.sync="showTrackDialog">
		<md-dialog-content>
			<md-dialog-title>{{ headline }}</md-dialog-title>

			<md-field :class="requiredName">
				<label>Name</label>
				<md-input v-model="track.name" required />
				<span class="md-error">Please enter a name</span>
			</md-field>

			<md-autocomplete v-model="track.country" md-dense :md-options="getCountryNames()" :class="requiredCountry" :md-fuzzy-search="false">
				<label>Country</label>

				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<md-highlight-text :md-term="term">
						{{ getCountryFlag(item) }} {{ item }}
					</md-highlight-text>
				</template>

				<template slot="md-autocomplete-empty" slot-scope="{ term }">
					"{{ term }}" not found!
				</template>

				<span class="md-error">Please choose a country</span>
			</md-autocomplete>

			<md-autocomplete v-model="track.timezone" md-dense :md-options="tz.tz_array.map(x=>({
				'name':x.name,
				'desc': x.desc,
				'toLowerCase':()=>x.desc.toLowerCase(),
				'toString':()=>tzDisplay(x)
			}))" :class="requiredTimezone" :md-fuzzy-search="false"
			>
				<label>Timezone</label>

				<template slot="md-autocomplete-item" slot-scope="{ item, term }">
					<md-highlight-text :md-term="term.desc ? term.desc : term">
						{{ tzDisplay(item) }}
					</md-highlight-text>
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
					{{ action }}
				</md-button>
			</md-dialog-actions>
		</md-dialog-content>
	</md-dialog>
</div>
</template>

<script>
import moment from 'moment-timezone';
import cl from 'country-list';
import flag from 'country-code-emoji';

export default {
	props: {
		showDialog: {
			type: Boolean,
			default: false
		},
		activeTrack: {
			type: Object,
			default: null
		},
		mode: {
			type: String,
			default: ''
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
				country: '',
				timezone: '',
				length: '',
				map: ''
			}
		};
	},
	computed: {
		headline() {
			switch(this.mode) {
				case 'create':
					return 'Create a Track';
				case 'update':
					return 'Update ' + this.track.name;
				default:
					return '';
			}
		},
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
		requiredCountry() {
			return {
				'md-invalid': cl.getCode(this.track.country) === undefined
			};
		},
		requiredName() {
			return {
				'md-invalid': !(this.track !== undefined && this.track.name.length > 0)
			};
		},
		requiredLength() {
			return {
				'md-invalid': isNaN(Number(this.track.length)) || Number(this.track.length) <= 0
			};
		},
		requiredTimezone() {
			return {
				'md-invalid': this.track.timezone === undefined || !this.track.timezone.desc
			};
		}
	},
	watch: {
		showDialog(newValue) {
			this.showTrackDialog = newValue;
		},
		showTrackDialog(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudTrack');
			if (newValue === true && this.mode === 'create')
				// Reset all values
				Object.keys(this.track).forEach(key => (this.track[key] = ''));
			if (newValue === true && this.mode === 'update' && this.activeTrack !== undefined) {
				// Might need to reset the object
				this.track = JSON.parse(JSON.stringify(this.activeTrack));
				let tz = this.tz.tz_array.find(e => e.name == this.track.timezone);
				this.track.timezone = {
					'name':tz.name,
					'desc':tz.desc,
					'toLowerCase':()=>tz.desc.toLowerCase(),
					'toString':()=>'(UTC' + moment.tz(tz.name).format('Z') + ') ' + tz.desc
				};
			}
		},
		activeTrack(newValue) {
			if (this.mode === 'update' && newValue !== undefined)
				// Need to copy the object in order to not change it when cancelling
				this.track = JSON.parse(JSON.stringify(this.activeTrack));
				let tz = this.tz.tz_array.find(e => e.name == this.track.timezone);
				this.track.timezone = {
					'name':tz.name,
					'desc':tz.desc,
					'toLowerCase':()=>tz.desc.toLowerCase(),
					'toString':()=>'(UTC' + moment.tz(tz.name).format('Z') + ') ' + tz.desc
				};
		}
	},
	methods: {
		async sendRequest() {
			let track = JSON.parse(JSON.stringify(this.track));
			track.timezone = track.timezone.name;
			if (this.mode === 'create') {
				try {
					const res = await this.$axios.$post('/api/calendar/track/create', {
						track
					});
					this.$root.$emit('trackCreated', res);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			} else if (this.mode === 'update') {
				// no need to update that
				delete track.createdAt;
				try {
					const res = await this.$axios.$post('/api/calendar/track/update/' + track.id, {
						track
					});
					if (res.updated >= 1)
					this.$root.$emit('trackUpdated', track);
				} catch(err) {
					if (err.response)
						alert(err.response);
				}
			}
			this.showTrackDialog = false;
		},
		validInput() {
			return this.track.name.length > 0 &&
				cl.getCode(this.track.country) !== undefined &&
				this.track.timezone.desc &&
				!isNaN(Number(this.track.length)) &&
				Number(this.track.length) > 0;
		},
		tzDisplay(item) {
			return '(UTC' + moment.tz(item.name).format('Z') + ') ' + item.desc;
		},
		getCountryNames() {
			return cl.getNames();
		},
		getCountryFlag(country) {
			return flag(cl.getCode(country));
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
