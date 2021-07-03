<template>
<div>
	<modal ref="deleteModal">
		<template #header>
			<h2>
				Delete "{{ toDelete ? toDelete.name : '' }}"
			</h2>
		</template>
		<template #body>
			<p>Are you sure you want to delete "{{ toDelete ? toDelete.name : '' }}"</p>
		</template>
		<template #footer>
			<div class="w-full flex justify-end space-x-4" @click="$refs.deleteModal.closeModal()">
				<button class="btn btn-link">
					Cancel
				</button>
				<button class="btn py-2 px-2 bg-red-600 text-white">
					Delete
				</button>
			</div>
		</template>
	</modal>
	<data-list :data="series" :visible-columns="visibleColumns" name="Series" @delete-item="showDeleteModal" />
</div>
</template>
<script>
import DataList from '@/components/admin/DataList';
import Modal from '@/components/simple/Modal';

export default {
	name: 'Series',
	components: { DataList, Modal },
	layout: 'admin',
	async asyncData({ $axios }) {
		try {
			const res = await $axios.$get('/api/series');
			return {
				series: res
			};
		} catch (err) {
			return {
				series: []
			};
		}
	},
	data() {
		return {
			series: [],
			visibleColumns: [
				{
					key: 'name',
					sortable: true
				}
			],
			deleteId: null
		};
	},
	computed: {
		toDelete() {
			if (this.deleteId)
				return this.series.find(entity => entity.id === this.deleteId);

			return null;
		}
	},
	methods: {
		showDeleteModal(data) {
			this.deleteId = data;
			this.$refs.deleteModal.openModal();
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
