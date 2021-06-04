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
						<Button icon="pi pi-pencil" @click="editSeries(slotProps.data)" />
						<Button icon="pi pi-trash" @click="sendDeleteRequest(slotProps.data)" />
					</div>
				</div>
			</template>
		</DataView>
	</div>

	<ResourcesSeriesCRUD
		:show-dialog="showDialog"
		:is-editing="isEditing"
		:editing-series="editingSeries"
		@series-crud-closed="closeSeriesCrud"
		@send-request="sendRequest"
	/>
</div>
</template>

<script>
import DataView from 'primevue/dataview';
import InputText from 'primevue/inputtext';
import { mapGetters, mapMutations } from 'vuex';

export default {
	components: {
		DataView, InputText
	},
	data() {
		return {
			searchTerm: '',
			displayedSeries: [],
			showDialog: false,
			isEditing: false,
			editingSeries: null
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
			deleteSeries: 'resources/series/delete',
			updateSeries: 'resources/series/update'
		}),
		openSeriesCrud() {
			this.showDialog = true;
		},
		closeSeriesCrud() {
			this.isEditing = false;
			this.showDialog = false;
			this.editingSeries = null;
		},
		editSeries(series) {
			this.isEditing = true;
			this.editingSeries = JSON.parse(JSON.stringify(series));
			this.showDialog = true;
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
			delete series.createdAt;
			let url;
			if (this.isEditing === false)
				url = '/api/calendar/series/create';
			else if (this.isEditing === true && this.editingSeries !== null)
				url = '/api/calendar/series/update/' + this.editingSeries.id;
			else
				console.error('Sending request for null-series');

			try {
				const res = await this.$axios.$post(url, {
					series
				});
				if (this.isEditing === false) {
					this.addSeries(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Series ' + series.name + ' created.', life: 5000 });
				} else {
					this.updateSeries(res);
					this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Series ' + series.name + ' updated.', life: 5000 });
				}
			} catch (err) {
				if (err.response)
					alert(err.response.data);
			}
			this.showDialog = false;
			this.isEditing = false;
			this.editingSeries = null;
		}
	}
};
</script>

<style scoped>

</style>
