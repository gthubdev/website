<template>
<div class="md-layout-item flex-start main-panel">
	<div class="md-layout headline">
		<div class="md-layout-item md-display-1">
			Series
		</div>

		<div class="md-layout-item">
			<md-field md-clearable>
				<label>Search term</label>
				<md-input v-model="searchTerm" />
			</md-field>
		</div>

		<div class="md-layout-item align-right">
			<md-button class="md-raised md-primary btn-primary" @click.native="createSeries()">
				Create Series
			</md-button>
		</div>
	</div>
	<md-list>
		<md-list-item v-for="s in filterSeries" :key="s.id">
			<span class="md-list-item-text">{{ s.name }}</span>
			<md-icon @click.native="updateSeries(s)">
				edit
			</md-icon>
			<md-icon @click.native="deleteSeries(s)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<CRUDSeries
		:show-dialog="showDialog"
		:active-series="activeSeries"
		:mode="mode"
		:vc="vehicleclasses"
	/>
</div>
</template>

<script>
import CRUDSeries from '~/components/resources/CRUD-Series.vue';

export default {
	components: {
		CRUDSeries
	},
	props: {
		series: {
			type: Array,
			default() { return []; }
		},
		vehicleclasses: {
			type: Array,
			default() { return []; }
		}
	},
	data: function() {
		return {
			showDialog: false,
			activeSeries: null,
			mode: '',
			searchTerm: ''
		};
	},
	computed: {
		filterSeries() {
			if (this.searchTerm.trim() === '')
				return this.series;
			else
				return this.series.filter(series => {
					return series.name.toLowerCase().includes(this.searchTerm.trim());
				});
		}
	},
	mounted() {
		this.$root.$on('toggleCrudSeries', () => {
			this.showDialog = !this.showDialog;
		});
	},
	methods: {
		createSeries() {
			this.mode = 'create';
			this.showDialog = !this.showDialog;
		},
		updateSeries(series) {
			this.activeSeries = series;
			this.mode = 'update';
			this.showDialog = !this.showDialog;
		},
		deleteSeries(series) {
			this.$root.$emit('confirmDeleteSeries', series);
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
.md-list {
	background-color: rgba(0, 0, 0, 0.3);
	margin-top: 0.5em;
	border-radius: 20px;
}
</style>
