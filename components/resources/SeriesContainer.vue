<template>
<div>
	<div class="p-grid p-align-center">
		<div class="p-col-4">
			<h2>
				Series
			</h2>
		</div>
		<div class="p-col-4">
			<span class="p-float-label">
				<InputText id="searchTerm" v-model="searchTerm" type="text" class="full-width" />
				<label for="searchTerm">Search term</label>
			</span>
		</div>
		<div class="p-col-4 align-right">
			<Button label="CREATE SERIES" class="p-button-raised" @click="createSeries()" />
		</div>
	</div>

	<DataView :value="shownSeries" paginator-position="bottom" :paginator="true" :rows="itemsPerPage" :always-show-paginator="false">
		<template #list="slotProps">
			<div class="p-grid p-align-center">
				<div class="p-col-9">
					<b>{{ slotProps.data.name }}</b>
				</div>
				<div class="p-col-3 align-right">
					<Button icon="pi pi-pencil" @click="updateSeries(slotProps.data)" />
					&nbsp; &nbsp;
					<Button icon="pi pi-trash" @click="deleteSeries(slotProps.data)" />
				</div>
			</div>
		</template>
	</DataView>

	<CreateSeries
		:show-dialog="showCreateDialog"
		:vc="vehicleclasses"
	/>

	<UpdateSeries
		:show-dialog="showUpdateDialog"
		:active-series="activeSeries"
		:vc="vehicleclasses"
	/>
</div>
</template>

<script>
import CreateSeries from '~/components/resources/series/Create-Series.vue';
import UpdateSeries from '~/components/resources/series/Update-Series.vue';
import { constants, strings } from '~/plugins/constants';

export default {
	components: {
		CreateSeries, UpdateSeries
	},
	props: {
		series: {
			type: Array, default() { return []; }
		},
		vehicleclasses: {
			type: Array, default() { return []; }
		}
	},
	data: function() {
		return {
			showCreateDialog: false,
			showUpdateDialog: false,
			activeSeries: null,
			searchTerm: '',
			shownSeries: null,
			itemsPerPage: constants.ITEMS_PER_PAGE_SERIES
		};
	},
    watch: {
        searchTerm(newValue) {
            if (newValue.trim() === '')
                this.shownSeries = this.series;
            else
                this.shownSeries = this.series.filter(s => {
                    return s.name.toLowerCase().includes(newValue.toLowerCase());
                });
        }
    },
	mounted() {
		// set the series
		this.shownSeries = this.series;

		this.$root.$on(strings.CLOSED_CRUD_SERIES, () => {
			this.showCreateDialog = false;
			this.showUpdateDialog = false;
		});

		// handle requests to create/update a series
		this.$root.$on(strings.SEND_REQUEST_CRUD_SERIES, async (tmpseries, vehicleClasses) => {
			//console.log('RECEIVED CREATE/UPDATE SERIES REQUEST');

			const series = JSON.parse(JSON.stringify(tmpseries));
			series.vehicleClasses = vehicleClasses;
			// create a series
			if (this.showCreateDialog === true) {
				try {
					const res = await this.$axios.$post('/api/calendar/series/create', {
						series
					});
					this.$root.$emit(strings.SERIES_CREATED, res);
				} catch(err) {
					console.log(JSON.stringify(err.response));
					if (err.response)
						alert(err.response);
				}
				this.showCreateDialog = false;
			}
			// update a series
			if (this.showUpdateDialog === true) {
				// no need to update that
				delete series.createdAt;
				try {
					const res = await this.$axios.$post('/api/calendar/series/update/' + series.id, {
						series
					});
					if (res.id && res.id >= 1)
					this.$root.$emit(strings.SERIES_UPDATED, res);
				} catch(err) {
					console.log(JSON.stringify(err.response));
					if (err.response)
						alert(err.response);
				}
				this.showUpdateDialog = false;
			}
		});
	},
	methods: {
		createSeries() {
			this.showCreateDialog = true;
		},
		updateSeries(series) {
			this.activeSeries = JSON.parse(JSON.stringify(series));
			this.showUpdateDialog = true;
		},
		deleteSeries(series) {
			this.$root.$emit(strings.CONFIRM_DELETE_SERIES, series);
		}
	}
};
</script>

<style lang="scss" scoped>
.headline {
	margin-bottom: 1em;
}
</style>
