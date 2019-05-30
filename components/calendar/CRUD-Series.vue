<template>
<div>
	<md-dialog :md-active.sync="showSeriesDialog">
		<md-dialog-title>Create a Series</md-dialog-title>

		<md-field>
			<label>Name</label>
			<md-input v-model="series.name" required></md-input>
		</md-field>

		<md-field>
			<label>Logo</label>
			<md-input v-model="series.logo"></md-input>
		</md-field>

		<md-field>
			<label>Homepage</label>
			<md-input v-model="series.homepage"></md-input>
		</md-field>

		<md-field>
			<label for="priority">Priority</label>
			<md-select v-model="series.priority" name="priority" id="priority" placeholder="Priority" required>
				<md-option v-for="i in 4" :key="i" :value="i">{{i}}</md-option>
			</md-select>
		</md-field>

		<md-dialog-actions>
			<md-button class="md-primary md-accent" @click="showSeriesDialog = false">Cancel</md-button>
			<md-button class="md-primary" @click="sendRequest()">Create</md-button>
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
