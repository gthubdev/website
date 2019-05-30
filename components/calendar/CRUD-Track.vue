<template>
<div>
	<md-dialog :md-active.sync="showTrackDialog">
		<md-dialog-title>Create a Track</md-dialog-title>

		<md-field :class="requiredName">
			<label>Name</label>
			<md-input v-model="track.name" required></md-input>
			<span class="md-error">Please enter a name</span>
		</md-field>

		<md-field>
			<label>Location</label>
			<md-input v-model="track.location"></md-input>
		</md-field>

		<md-field :class="requiredLength">
			<label>Length</label>
			<md-input v-model="track.length" required></md-input>
			<span class="md-error">Please enter a valid length</span>
		</md-field>

		<md-field>
			<label>Map</label>
			<md-input v-model="track.map"></md-input>
		</md-field>

		<md-dialog-actions>
			<md-button class="md-primary md-accent" @click="showTrackDialog = false">Cancel</md-button>
			<md-button class="md-raised md-primary" @click="sendRequest()" :disabled="!validInput()">Create</md-button>
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
		}
	},
	data: function() {
		return {
			showTrackDialog: false,
			track: {
				name: '',
				location: '',
				length: '',
				map: ''
			}
		};
	},
	methods: {
		async sendRequest() {
			const track = JSON.parse(JSON.stringify(this.track));
			this.showTrackDialog = false;
			const res = await this.$axios.$post('/api/calendar/track/create', {
				track
			});
			this.$root.$emit('trackCreated', res);
		},
		validInput: function() {
			return this.track.name.length > 0 && !isNaN(Number(this.track.length)) && Number(this.track.length) > 0;
		}
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
