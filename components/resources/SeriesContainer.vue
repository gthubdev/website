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
			<md-icon>
				edit
			</md-icon>
			<md-icon>
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<CRUDSeries
		:show-dialog="showDialog"
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
			showDialog: false
		};
	},
	mounted() {
		this.$root.$on('toggleCrudSeries', () => {
			this.showDialog = !this.showDialog;
		});
	},
	methods: {
		createSeries() {
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
