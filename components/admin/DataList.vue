<template>
<div class="py-4">
	<div class="w-full mt-3 mb-5 flex justify-between">
		<div>
			<span class="p-input-icon-left">
				<i class="pi pi-search" />
				<InputText id="seriesSearchTerm" v-model="searchTerm" type="text" />
			</span>
		</div>
		<nuxt-link class="btn btn-primary py-2 px-3 text-white" to="new" append>
			<i class="pi pi-plus pi-inline mr-1" /> Add {{ name }}
		</nuxt-link>
	</div>
	<DataTable class="shadow-md" :value="displayedData" :paginator="true" :rows="10">
		<Column :sortable="true" header-style="width:8ch" body-style="padding: 0 2rem;text-align:end; font-variant-numeric: tabular-nums" field="id" header="id" />
		<Column v-for="(col, i) in visibleColumns" :key="i" :field="col.key" :header="col.key" :sortable="col.sortable">
			<template #body="slotProps">
				<div class="flex items-center">
					<img v-if="slotProps.data.thumbnail" :src="slotProps.data.thumbnail" :alt="slotProps.data[col.key]" class="inline w-10 mr-2">
					<span>{{ slotProps.data[col.key] }}</span>
				</div>
			</template>
		</Column>
		<!-- <Column :sortable="true" field="name" header="Name">
			<template #body="slotProps">
				<div class="flex items-center">
					<img class="w-12 mr-2" :src="slotProps.data.thumbnail" :alt="slotProps.data.name">
					<p>{{ slotProps.data.name }}</p>
				</div>
			</template>
		</Column> -->
		<Column field="createdAt" header="created at">
			<template #body="slotProps">
				<span>{{ $dayjs(slotProps.data.createdAt).format('DD/MM/YYYY HH:mm:ss') }}</span>
			</template>
		</Column>
		<Column header-style="width: 15%" header="actions">
			<template #body="slotProps">
				<div class="space-x-4">
					<nuxt-link :to="slotProps.data.id.toString()" append class="btn btn-link p-3 hover:text-gth-blue">
						<i class="pi pi-pencil" />
					</nuxt-link>
					<button class="btn btn-link p-3 text-red-600 hover:bg-red-600 hover:text-white" @click="$emit('delete-item', slotProps.data.id)">
						<i class="pi pi-trash" />
					</button>
				</div>
			</template>
		</Column>
	</DataTable>
</div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';

export default {
	components: {
		DataTable,
		Column,
		InputText
	},
	props: {
		data: {
			type: Array,
			default() {
				return [];
			}
		},
		visibleColumns: {
			type: Array,
			default() {
				return [];
			}
		},
		name: {
			type: String,
			default: 'Content'
		}
	},
	data() {
		return {
			searchTerm: ''
		};
	},
	computed: {
		displayedData() {
			if (this.searchTerm)
				return this.data.filter(item => item.name.includes(this.searchTerm));

			return this.data;
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
