<template>
<div class="resources">
	<div class="resources-top-bar">
		<div>
			<span class="p-input-icon-left">
				<i class="pi pi-search" />
				<InputText id="seriesSearchTerm" v-model="searchTerm" type="text" />
			</span>
		</div>
		<div>
			<Button label="CREATE SERIES" class="p-button-raised" @click="openSeriesCrud()" />
		</div>
	</div>
	<div>
		<DataView
			:value="displayedSeries"
			paginator-position="bottom"
			:paginator="true"
			:rows="10"
			:always-show-paginator="false"
		>
			<template #list="slotProps">
				<div class="resource-list-item-container">
					<div class="resource-list-item">
						{{ slotProps.data.name }}
					</div>
					<div>
						<Button icon="pi pi-trash" @click="sendDeleteRequest(slotProps.data)" />
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<SeriesCRUD
		:show-dialog="showDialog"
		@series-crud-closed="closeSeriesCrud"
		@send-request="sendRequest"
	/>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import SeriesCRUD from '@/components/resources/SeriesCRUD';
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: {
		DataView, InputText, SeriesCRUD
	},
	data() {
		return {
			searchTerm: '',
			displayedSeries: [],
			showDialog: false
		};
	},
	computed: {
		...mapGetters({
			series: 'resources/series/get'
		})
	},
	watch: {
		searchTerm(newvalue) {
			if (newvalue.trim() === '')
				this.displayedSeries = [...this.series];
			else
				this.displayedSeries = this.series.filter(t => {
					return t.name.toLowerCase().includes(newvalue.toLowerCase());
				});
		}
	},
	created() {
		this.displayedSeries = this.series;
	},
	methods: {
		...mapMutations({
			addSeries: 'resources/series/add',
			deleteSeries: 'resources/series/delete'
		}),
		openSeriesCrud() {
			this.showDialog = true;
		},
		closeSeriesCrud() {
			this.showDialog = false;
		},
		async sendDeleteRequest(series) {
			try {
				const res = await this.$axios.post('/api/calendar/series/delete/' + series.id);
				if (res.data.deleted >= 1) {
					this.deleteSeries(series.id);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Series ' + series.name + ' deleted.', life: 5000 });
				}
			} catch (err) {
				if (err.response && err.response.status === 409)
					alert(err.response.data);
				else if (err.response)
					alert(err.response);
			}
		},
		async sendRequest(obj) {
			const series = JSON.parse(JSON.stringify(obj));
			const url = '/api/calendar/series/create';

			try {
				const res = await this.$axios.$post(url, {
					series
				});
				this.addSeries(res);
				this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Series ' + series.name + ' created.', life: 5000 });
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}
			this.showDialog = false;
		}
	}
};
</script>

<style scoped>

</style>
