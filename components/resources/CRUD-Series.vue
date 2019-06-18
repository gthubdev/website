<template>
<div>
	<md-dialog :md-active.sync="showSeriesDialog">
		<md-dialog-title>{{ headline }}</md-dialog-title>

		<md-field :class="requiredName">
			<label>Name</label>
			<md-input v-model="series.name" required />
			<span class="md-error">Please enter a name</span>
		</md-field>

		<md-field :class="requiredLogo">
			<label>Logo</label>
			<md-input v-model="series.logo" required />
			<span class="md-error">Please enter a URL</span>
		</md-field>

		<md-field>
			<label>Homepage</label>
			<md-input v-model="series.homepage" />
		</md-field>

		<md-field :class="requiredPriority">
			<label for="priority">Priority</label>
			<md-select id="priority" v-model="series.priority" name="priority" placeholder="Priority" required>
				<md-option v-for="i in 4" :key="i" :value="i">
					{{ i }}
				</md-option>
			</md-select>
			<span class="md-error">Please choose a priority</span>
		</md-field>

		<md-dialog-actions>
			<md-button class="md-primary md-accent" @click="showSeriesDialog = false">
				Cancel
			</md-button>
			<md-button class="md-raised md-primary" :disabled="!validInput()" @click="sendRequest()">
				{{ action }}
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
		activeSeries: {
			type: Object,
			default: null
		},
		mode: {
			type: String,
			default: ''
		}
	},
	data: function() {
		return {
			showSeriesDialog: false,
			series: {
				name: '',
				logo: '',
				homepage: '',
				priority: ''
			}
		};
	},
	computed: {
		headline() {
			switch(this.mode) {
				case 'create':
					return 'Create a Series';
				case 'update':
					return 'Update ' + this.series.name;
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
		requiredName() {
			return {
				'md-invalid': !(this.series.name.length > 0)
			};
		},
		requiredLogo() {
			return {
				'md-invalid': !(this.series.logo.length >= 1)
			};
		},
		requiredPriority() {
			return {
				'md-invalid': !(this.series.priority >= 1)
			};
		}
	},
	watch: {
		showDialog: function(newValue) {
			this.showSeriesDialog = newValue;
		},
		showSeriesDialog: function(newValue, oldValue) {
			if (oldValue === true)
				this.$root.$emit('toggleCrudSeries');
			if (newValue === true && this.mode === 'create')
				// Reset all values
				Object.keys(this.series).forEach(key => (this.series[key] = ''));
			if (newValue === true && this.mode === 'update' && this.activeSeries !== undefined)
				// Might need to reset the object
				this.series = JSON.parse(JSON.stringify(this.activeSeries));
		},
		activeSeries: function(newValue) {
			if (this.mode === 'update' && newValue !== undefined)
				// Need to copy the object in order to not change it when cancelling
				this.series = JSON.parse(JSON.stringify(this.activeSeries));
		}
	},
	methods: {
		async sendRequest() {
			const series = JSON.parse(JSON.stringify(this.series));
			if (this.mode === 'create') {
				const res = await this.$axios.$post('/api/calendar/series/create', {
					series
				});
				this.$root.$emit('seriesCreated', res);
			} else if (this.mode === 'update') {
				// no need to update that
				delete series.createdAt;
				const res = await this.$axios.$post('/api/calendar/series/update/' + series.id, {
					series
				});
				if (res.updated >= 1)
					this.$root.$emit('seriesUpdated', series);
			}
			this.showSeriesDialog = false;
		},
		validInput: function() {
			return this.series.name.length > 0 && this.series.priority >= 1;
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
