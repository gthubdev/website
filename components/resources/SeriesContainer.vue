<template>
<div class="md-layout-item flex-start main-panel">
	<div class="headline">
		<span class="md-display-1">Series</span>
	</div>
	<md-button class="md-raised md-primary" @click.native="createSeries()">
		Create Series
	</md-button>
	<md-list>
		<md-list-item v-for="s in series" :key="s.id">
			<span class="md-list-item-text">{{ s.name }}</span>
			<md-icon @click.native="updateSeries(s)">
				edit
			</md-icon>
			<md-icon @click.native="deleteSeries(s.id)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<CRUDSeries
		:show-dialog="showDialog"
		:active-series="activeSeries"
		:mode="mode"
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
		}
	},
	data: function() {
		return {
			showDialog: false,
			activeSeries: null,
			mode: ''
		};
	},
	mounted() {
		this.$root.$on('toggleCrudSeries', () => {
			this.showDialog = !this.showDialog;
		});
	},
	methods: {
		async deleteSeries(id) {
			try {
				const res = await this.$axios.$post('/api/calendar/series/delete/' + id);
				if (res.deleted >= 1)
					this.$root.$emit('seriesDeleted', id);
			} catch(err) {
				if (err.response && err.response.status == 409)
					alert(err.response.data);
			}
		},
		createSeries() {
			this.mode = 'create';
			this.showDialog = !this.showDialog;
		},
		updateSeries(series) {
			this.activeSeries = series;
			this.mode = 'update';
			this.showDialog = !this.showDialog;
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
