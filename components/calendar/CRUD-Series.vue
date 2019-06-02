<template>
<div>
	<md-dialog :md-active.sync="showSeriesDialog">
		<md-dialog-title>Create a Series</md-dialog-title>

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
			if (newValue === true)
				Object.keys(this.series).forEach(key => (this.series[key] = ''));
		}
	},
	methods: {
		async sendRequest() {
			const series = JSON.parse(JSON.stringify(this.series));
			this.showSeriesDialog = false;
			const res = await this.$axios.$post('/api/calendar/series/create', {
				series
			});
			this.$root.$emit('seriesCreated', res);
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
