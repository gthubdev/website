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
		<md-list-item v-for="s in filterSeries()" :key="s.id">
			<span class="md-list-item-text">{{ s.name }}</span>
			<md-icon @click.native="updateSeries(s)">
				edit
			</md-icon>
			<md-icon @click.native="deleteSeries(s)">
				delete
			</md-icon>
		</md-list-item>
	</md-list>

	<div v-if="showPagination">
		<paginate
			:page-count="pageCount"
			:click-handler="pageClicked"
			:no-li-surround="true"
			:container-class="'pag-container'"
			:active-class="'pag-active'"
			:page-link-class="'pag-page-link'"
			:hide-prev-next="true"
		/>
	</div>

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
import Paginate from 'vuejs-paginate/src/components/Paginate.vue';
import { constants } from '~/plugins/constants';

export default {
	components: {
		CRUDSeries, Paginate
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
			searchTerm: '',
			showPagination: false,
			pageNumber: 1,
			pageCount: 1,
			itemsPerPage: constants.ITEMS_PER_PAGE_SERIES
		};
	},
	mounted() {
		this.$root.$on('toggleCrudSeries', () => {
			this.showDialog = !this.showDialog;
		});
		this.pageCount = Math.ceil(this.series.length / this.itemsPerPage);
		this.showPagination = this.pageCount > 1;
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
		},
		filterSeries() {
			let arr = [], nrMatches = 0;

			// count number of elements matching
			if (this.searchTerm.trim() === '') {
				nrMatches = this.series.length;
			} else {
				this.series.forEach(e => {
					if (e.name.toLowerCase().includes(this.searchTerm.trim()))
						nrMatches++;
				});
			}

			// do the actual filtering
			for (let i = (this.pageNumber - 1) * this.itemsPerPage; i < this.series.length && arr.length < this.itemsPerPage; i++) {
				if (this.searchTerm.trim() === '')
					arr.push(this.series[i]);
				else if (this.series[i].name.toLowerCase().includes(this.searchTerm.trim()))
					arr.push(this.series[i]);
			}

			this.pageCount = Math.ceil(nrMatches / this.itemsPerPage);
			this.showPagination = this.pageCount > 1;
			return arr;
		},
		pageClicked(newPageNum) {
			console.log('Active Page: ' + newPageNum);
			this.pageNumber = newPageNum;
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
