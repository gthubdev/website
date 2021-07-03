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
				<button class="btn py-2 px-2 bg-red-600 text-white" @click="deleteItem(toDelete.id)">
					<span><i class="pi pi-trash" /> Delete</span>
				</button>
			</div>
		</template>
	</modal>
	<data-list :data="data" :visible-columns="visibleColumns" name="Track" @delete-item="showDeleteModal" />
</div>
</template>
<script>
import DataList from '@/components/admin/DataList';
import Modal from '@/components/simple/Modal';

export default {
	name: 'Series',
	components: { DataList, Modal },
	layout: 'admin',
	middleware: 'auth',
	async asyncData({ $axios }) {
		try {
			const res = await $axios.$get('/api/track');
			return {
				data: res
			};
		} catch (err) {
			return {
				data: []
			};
		}
	},
	data() {
		return {
			data: [],
			visibleColumns: [
				{
					key: 'name',
					name: 'name',
					isRelation: false,
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
		},
		async deleteItem(id) {
			try {
				await this.$axios.delete(`/api/tracks/${id}`);
				const { data } = await this.$axios.get('/api/tracks');
				this.series = data;
			} catch (err) {
				this.$toast.add({ severity: 'error', summary: 'Oh no!', detail: 'Something went wrong while deleting a series.', life: 5000 });
			}
		}
	}
};
</script>
